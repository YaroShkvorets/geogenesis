import { PersonalHomeSidebar } from '~/partials/personal-home/personal-home-sidebar';
import { PersonalHomeUserBanner } from '~/partials/personal-home/personal-home-user-banner';

export default function PersonalSpace() {
  return (
    <div className="flex flex-col mx-28">
      <PersonalHomeUserBanner />
      <PersonalHomeSidebar />
    </div>
  );
}
