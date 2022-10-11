import { Signer } from 'ethers';
import { BehaviorSubject, Subscription } from 'rxjs';
import { INetwork } from '~/modules/services/network';
import { createTripleId } from '../services/create-id';
import { dedupe } from '../services/sync';
import { ReviewState, Triple } from '../types';

interface ITripleStoreConfig {
  api: INetwork;
  initialtriples?: Triple[];
}

interface ITripleStore {
  triples$: BehaviorSubject<Triple[]>;
  changedTriples$: BehaviorSubject<Triple[]>;
  create(triples: Triple[]): void;
  update(triple: Triple, oldTriple: Triple): void;
  publish(signer: Signer, onChangePublishState: (newState: ReviewState) => void): void;
}

export class TripleStore implements ITripleStore {
  api: INetwork;
  triples$: BehaviorSubject<Triple[]>; // state of the triples as they exist right now
  changedTriples$ = new BehaviorSubject<Triple[]>([]); // history of the triples that have changed mapped to 'created' | 'deleted' status
  private tripleIds = new Set<string>();

  constructor({ api, initialtriples = [] }: ITripleStoreConfig) {
    this.api = api;
    this.triples$ = new BehaviorSubject(initialtriples);

    // If you want to keep the local triples in sync with the remote triples, you can do this:
    // this.api.syncer$.subscribe(serverTriples => {
    //   // Only update state with the union of the local and remote stores
    //   // state = (local - remote) + remote
    //   const mergedTriples = dedupe(this.triples, serverTriples, this.tripleIds);

    //   // If a triple that exists on the backend has been changed locally we don't want to load the now stale triple
    //   const newTriples = mergedTriples.filter(triple => {
    //     const mergedTripleId = createTripleId(triple);

    //     return !this.changedTriples$.value.some(
    //       changedTriple => mergedTripleId === createTripleId(changedTriple) && changedTriple.status === 'deleted'
    //     );
    //   });

    //   this.triples$.next(newTriples);
    // });

    // When triples are updated we can precalculate the ids for deduping.
    // Is this faster than calling this.tripleIds.add(triple.id) in the
    // sync subscriber and any mutations to the triples array (i.e., createTriple)?
    this.triples$.subscribe(value => {
      this.tripleIds = new Set(value.map(triple => triple.id));
    });
  }

  create = (triples: Triple[]) => {
    triples.forEach(triple => (triple.status = 'created'));
    this.triples$.next([...triples, ...this.triples]);
    this.changedTriples$.next([...this.changedTriples$.value, ...triples]);
  };

  // create = (triple: Triple) => {
  //   triple.status = 'created';
  //   this.triples$.next([triple, ...this.triples]);
  //   this.changedTriples$.next([...this.changedTriples$.value, triple]);
  // };

  update = (triple: Triple, oldTriple: Triple) => {
    const index = this.triples.findIndex(t => t.id === oldTriple.id);
    const triples = this.triples$.value;

    // If there haven't been actual changes to the data we can skip updates
    if (triple.value.value === oldTriple.value.value && triple.attributeId === oldTriple.attributeId) {
      return;
    }

    // We need to ensure we are tracking the state of the original triple and the state of
    // the most recent triple. This is because our backend expects a create + delete when a
    // triple is edited.
    //
    // If a triple is just created then we need to track all subsequent updates to it _without_
    // a delete pair.
    //
    // If a triple already exists on the backend and has been updated locally, we need to track
    // the original state of the triple as well as the most recent state of the triple, but make
    // sure we don't track intermediate states since they aren't important.
    if (oldTriple.status === 'created') {
      const indexOfChangedTriple = this.changedTriples$.value.findIndex(t => t.id === oldTriple.id);
      triple.status = 'created';
      const changedTriples = this.changedTriples$.value;
      changedTriples[indexOfChangedTriple] = triple;
      this.changedTriples$.next(changedTriples);
    } else {
      triple.status = 'edited';
      const lastVersionIndex = this.changedTriples$.value.findIndex(t => t.id === oldTriple.id);

      if (lastVersionIndex === -1) {
        this.changedTriples$.next([
          ...this.changedTriples$.value,
          {
            ...oldTriple,
            status: 'deleted',
          },
        ]);
      } else {
        // Remove the last version of the changed triple from the changedTriples$.value array. We only
        // want to publish the deletion of the first version of the triple and the creation of
        // the latest version.
        // Using splice is going to be faster than filtering potentially large triples array
        this.changedTriples$.value.splice(lastVersionIndex, 1);
      }

      triple.id = createTripleId(triple.entityId, triple.attributeId, triple.value);

      this.changedTriples$.next([
        ...this.changedTriples$.value,
        {
          ...triple,
          status: 'created',
        },
      ]);
    }

    triples[index] = triple;
    this.triples$.next(triples);
  };

  publish = async (signer: Signer, onChangePublishState: (newState: ReviewState) => void) => {
    try {
      await this.api.publish(this.changedTriples$.value, signer, onChangePublishState);

      const triples = this.triples.map(triple => ({
        ...triple,
        status: undefined,
      }));

      this.changedTriples$.next([]);
      this.triples$.next(triples);
    } catch (e) {
      console.error(e);
    }
  };

  loadNetworkTriples = async () => {
    const networkTriples = await this.api.getNetworkTriples();
    console.log(`loadingNetworkTriples`);
    this.triples$.next(networkTriples);
  };

  get triples() {
    return this.triples$.value;
  }
}
