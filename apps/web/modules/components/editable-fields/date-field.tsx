import * as React from 'react';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { GeoDate } from '~/modules/utils';
import { Minus } from '~/modules/design-system/icons/minus';
import { Spacer } from '~/modules/design-system/spacer';
import { SmallButton } from '~/modules/design-system/button';

interface DateFieldProps {
  onBlur?: (date: string) => void;
  variant?: 'body' | 'tableCell';
  value: string;
  isEditing?: boolean;
}

const dateFieldStyles = cva(
  'w-full placeholder:text-grey-02 focus:outline-none tabular-nums transition-colors duration-75 ease-in-out text-center',
  {
    variants: {
      variant: {
        body: 'text-body',
        tableCell: 'text-tableCell',
      },
      error: {
        true: 'text-red-01',
      },
    },
    defaultVariants: {
      variant: 'body',
      error: false,
    },
  }
);

const labelStyles = cva('text-footnote transition-colors duration-75 ease-in-out', {
  variants: {
    active: {
      true: 'text-text',
      false: 'text-grey-02',
    },
    error: {
      true: 'text-red-01',
    },
  },
  defaultVariants: {
    active: false,
    error: false,
  },
});

const timeStyles = cva('w-[21px] placeholder:text-grey-02 focus:outline-none tabular-nums', {
  variants: {
    variant: {
      body: 'text-body',
      tableCell: 'text-tableCell',
    },
    error: {
      true: 'text-red-01',
    },
  },
  defaultVariants: {
    variant: 'body',
    error: false,
  },
});

function useFormWithValidation<T>(values: T, validate: (values: T) => boolean) {
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      setIsValidating(true);
      validate(values);
      setError(null);
      setIsValidating(false);
    } catch (e: unknown) {
      setError((e as Error).message);
      setIsValidating(false);
    }
  }, [values, validate]);

  return [
    {
      isValid: error === null,
      isValidating,
      error,
    },
  ];
}

function useFieldWithValidation(
  initialValue: string,
  { validate, transform }: { validate: (value: string) => boolean; transform?: (value: string) => string }
) {
  const [value, setValue] = React.useState(initialValue);
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const memoizedValidate = React.useCallback(validate, [validate]);
  const memoizedTransformedValue = React.useMemo(() => {
    if (transform) {
      return transform(value);
    }

    return value;
  }, [transform, value]);

  React.useEffect(() => {
    try {
      setIsValidating(true);
      memoizedValidate(memoizedTransformedValue);
      setError(null);
      setIsValidating(false);
    } catch (e: unknown) {
      setError((e as Error).message);
      setIsValidating(false);
    }
  }, [memoizedTransformedValue, memoizedValidate]);

  return [
    {
      value: memoizedTransformedValue,
      error,
      isValidating,
      isValid: error === null,
    },
    (v: string) => setValue(v),
  ] as const;
}

export function DateField(props: DateFieldProps) {
  const {
    day: initialDay,
    month: initialMonth,
    year: initialYear,
    hour: initialHour,
    minute: initialMinute,
  } = GeoDate.fromISOStringUTC(props.value);

  const [day, setDay] = useFieldWithValidation(initialDay.padStart(2, '0'), {
    validate: (v: string) => {
      const regex = /^[0-9]*$/;

      if (v !== '') {
        if (!regex.test(v)) throw new Error('Day must be a number');
        if (v.length > 2) throw new Error("Day can't be longer than 2 characters");
        if (Number(v) > 31) throw new Error('Day must be less than 31');
        if (Number(v) < 1) throw new Error('Day must be greater than 0');
      }

      return true;
    },
  });

  const [month, setMonth] = useFieldWithValidation(initialMonth.padStart(2, '0'), {
    validate: (v: string) => {
      const regex = /^[0-9]*$/;

      if (v !== '') {
        if (!regex.test(v)) throw new Error('Month must be a number');
        if (v.length > 2) throw new Error("Month can't be longer than 2 characters");
        if (Number(v) > 12) throw new Error('Month must be 12 or less');
        if (Number(v) < 1) throw new Error('Month must be greater than 0');
      }

      return true;
    },
  });

  const [year, setYear] = useFieldWithValidation(initialYear.padStart(4, '0'), {
    validate: (v: string) => {
      const regex = /^[0-9]*$/;

      if (v !== '') {
        if (!regex.test(v)) throw new Error('Year must be a number');
        if (v.length < 4) throw new Error('Year must be 4 characters');
      }

      return true;
    },
  });

  const [hour, setHour] = useFieldWithValidation(initialHour.padStart(2, '0'), {
    validate: (v: string) => {
      const regex = /^[0-9]*$/;

      if (v !== '') {
        if (!regex.test(v)) throw new Error('Hour must be a number');
        if (Number(v) > 12) throw new Error('Hour must be 12 or less');
        if (Number(v) < 1) throw new Error('Hour must be greater than 0');
      }

      return true;
    },
  });

  const [minute, setMinute] = useFieldWithValidation(initialMinute.padStart(2, '0'), {
    validate: (v: string) => {
      const regex = /^[0-9]*$/;

      console.log('validate', v);

      if (v !== '') {
        if (!regex.test(v)) throw new Error('Minute must be a number');
        if (Number(v) > 59) throw new Error('Minute must be 59 or less');
        if (Number(v) < 0) throw new Error('Minute must be 0 or greater');
      }

      return true;
    },
  });

  const [dateFormState] = useFormWithValidation({ day: day.value, month: month.value, year: year.value }, values => {
    if (values.month !== '') {
      const dayAsNumber = Number(values.day);
      const yearAsNumber = Number(values.year);

      if (dayAsNumber > 30 && GeoDate.isMonth30Days(Number(values.month))) {
        throw new Error('Day must be less than 31 for the entered month');
      }

      // Check leap year in order to validate February has 29 days
      if (GeoDate.isLeapYear(yearAsNumber)) {
        if (dayAsNumber > 29 && Number(values.month) === 2) {
          throw new Error('Day must be less than 30 for the entered month');
        }
      } else {
        // Otherwise we validate that February has 28 days
        if (dayAsNumber > 28 && Number(values.month) === 2) {
          throw new Error('Day must be less than 29 for the entered month');
        }
      }
    }

    return true;
  });

  const [timeFormState] = useFormWithValidation({ hour: hour.value, minute: minute.value }, values => {
    if (values.hour !== '') {
      if (values.minute === '') {
        throw new Error("Must enter a minute if you've entered an hour");
      }
    }

    if (values.minute !== '') {
      if (values.hour === '') {
        throw new Error("Must enter an hour if you've entered a minute");
      }
    }

    return true;
  });

  const [meridiem, setMeridiem] = React.useState<'am' | 'pm'>(Number(initialHour) < 12 ? 'am' : 'pm');

  const onToggleMeridiem = () => {
    const newMeridiem = meridiem === 'am' ? 'pm' : 'am';
    onBlur(meridiem);
    setMeridiem(newMeridiem);
  };

  const onDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (value.length > 2) return;
    setDay(value);
  };

  const onMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (value.length > 2) return;
    setMonth(value);
  };

  const onYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (value.length > 4) return;
    setYear(value);
  };

  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (value.length > 2) return;

    setMinute(value);
  };

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (value.length > 2) return;

    setHour(value);
  };

  const onBlur = (meridiem: 'am' | 'pm') => {
    try {
      const newMeridiem = meridiem === 'am' ? 'pm' : 'am';

      let newMinute = minute.value;
      let newHour = hour.value;
      let newDay = day.value;
      let newMonth = month.value;
      let newYear = year.value;

      if (Number(minute.value) < 10 && minute.value !== '') {
        newMinute = minute.value.padStart(2, '0');
        setMinute(newMinute);
      }

      if (Number(hour.value) < 10 && hour.value !== '') {
        newHour = hour.value.padStart(2, '0');
        setHour(newHour);
      }

      if (Number(day.value) < 10) {
        newDay = day.value.padStart(2, '0');
        setDay(newDay);
      }

      if (Number(month.value) < 10) {
        newMonth = month.value.padStart(2, '0');
        setMonth(newMonth);
      }

      if (Number(year.value) < 1000 || Number(year.value) < 100 || Number(year.value) < 10) {
        newYear = year.value.padStart(4, '0');
        setYear(newYear);
      }

      if (dateFormState && timeFormState) {
        // GeoDate.toISOStringUTC will throw an error if the date is invalid
        const isoString = GeoDate.toISOStringUTC({
          day: newDay,
          month: newMonth,
          year: newYear,
          minute: newMinute,
          hour: newMeridiem === 'am' ? newHour : (Number(newHour) + 12).toString(),
        });

        console.log(isoString);

        // Only create the triple if the form is valid
        props.onBlur?.(isoString);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isValidDateForm = dateFormState.isValid;
  const isValidTimeForm = timeFormState.isValid;
  const isValidDay = day.value === '' || (!day.isValidating && day.isValid);
  const isValidHour = hour.value === '' || (!hour.isValidating && hour.isValid);
  const isValidMinute = minute.value === '' || (!minute.isValidating && minute.isValid);
  const isValidMonth = month.value === '' || (!month.isValidating && month.isValid) || !isValidDateForm;
  const isValidYear = year.value === '' || (!year.isValidating && year.isValid);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex max-w-[164px] gap-3">
          <div className="flex w-full flex-col" style={{ flex: 2 }}>
            {props.isEditing ? (
              <input
                data-testid="date-field-month"
                value={month.value}
                onChange={onMonthChange}
                onBlur={() => onBlur(meridiem)}
                placeholder="MM"
                className={dateFieldStyles({
                  variant: props.variant,
                  error: !isValidMonth || !isValidDateForm,
                })}
              />
            ) : (
              <p className={dateFieldStyles({ variant: props.variant, error: !isValidMonth || !isValidDateForm })}>
                {month.value}
              </p>
            )}
            <span className={labelStyles({ active: month.value !== '', error: !isValidMonth || !isValidDateForm })}>
              Month
            </span>
          </div>

          <span style={{ flex: 1 }} className="w-full pt-[3px] text-grey-02">
            /
          </span>

          <div className="flex flex-col items-center" style={{ flex: 2 }}>
            {props.isEditing ? (
              <input
                data-testid="date-field-day"
                value={day.value}
                onChange={onDayChange}
                onBlur={() => onBlur(meridiem)}
                placeholder="DD"
                className={dateFieldStyles({
                  variant: props.variant,
                  error: !isValidDay || !isValidDateForm,
                })}
              />
            ) : (
              <p
                className={dateFieldStyles({
                  variant: props.variant,
                  error: !isValidDay || !isValidDateForm,
                })}
              >
                {day.value}
              </p>
            )}
            <span className={labelStyles({ active: day.value !== '', error: !isValidDay || !isValidDateForm })}>
              Day
            </span>
          </div>

          <span style={{ flex: 1 }} className="pt-[3px] text-grey-02">
            /
          </span>

          <div className="flex w-full flex-col items-center" style={{ flex: 4 }}>
            {props.isEditing ? (
              <input
                data-testid="date-field-year"
                value={year.value}
                onChange={onYearChange}
                onBlur={() => onBlur(meridiem)}
                placeholder="YYYY"
                className={dateFieldStyles({ variant: props.variant, error: !isValidYear || !dateFormState.isValid })}
              />
            ) : (
              <p className={dateFieldStyles({ variant: props.variant, error: !isValidYear || !dateFormState.isValid })}>
                {year.value}
              </p>
            )}
            <span className={labelStyles({ active: year.value !== '', error: !isValidYear || !dateFormState.isValid })}>
              Year
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <Minus color="grey-03" />
          <Spacer width={18} />
          {props.isEditing ? (
            <div className="flex items-center justify-start gap-1">
              <input
                data-testid="date-field-hour"
                value={hour.value}
                onChange={onHourChange}
                onBlur={() => onBlur(meridiem)}
                placeholder="00"
                className={timeStyles({ variant: props.variant, error: !isValidHour || !isValidTimeForm })}
              />
              <span>:</span>
              <input
                data-testid="date-field-minute"
                value={minute.value}
                onChange={onMinuteChange}
                onBlur={() => onBlur(meridiem)}
                placeholder="00"
                className={timeStyles({ variant: props.variant, error: !isValidMinute || !isValidTimeForm })}
              />
            </div>
          ) : (
            <div className="flex items-center justify-start gap-1">
              <p className={timeStyles({ variant: props.variant })}>{hour.value}</p>
              <span>:</span>
              <p className={timeStyles({ variant: props.variant })}>{minute.value}</p>
              <p className="text-body uppercase">{meridiem}</p>
            </div>
          )}

          {props.isEditing && (
            <>
              <Spacer width={12} />
              <motion.div whileTap={{ scale: 0.95 }} className="focus:outline-none">
                <SmallButton
                  onClick={() => (props.isEditing ? onToggleMeridiem() : undefined)}
                  variant="secondary"
                  className="uppercase"
                >
                  {meridiem}
                </SmallButton>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <div className="overflow-hidden">
          {!isValidHour && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              Entered hour is not valid. Please use a 12 hour format.
            </motion.p>
          )}
          {!isValidMinute && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              Entered minute is not valid.
            </motion.p>
          )}
          {!isValidDay && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              Entered day is not valid
            </motion.p>
          )}
          {!isValidMonth && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              Entered month is not valid
            </motion.p>
          )}
          {!isValidYear && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              Entered year is not valid
            </motion.p>
          )}
          {!isValidDateForm && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              {dateFormState.error}
            </motion.p>
          )}
          {!isValidTimeForm && (
            <motion.p
              className="mt-2 text-smallButton text-red-01"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, bounce: 0.2 }}
            >
              {timeFormState.error}
            </motion.p>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
