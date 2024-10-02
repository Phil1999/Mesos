import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, format, isSameDay, subDays, parseISO } from "date-fns"
import { toZonedTime } from "date-fns-tz"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}


export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(
  value: number,
  options: { addPrefix? : boolean } = {
    addPrefix: false,
  },
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent",
  }).format(value / 100)

  if (options.addPrefix && value > 0) {
    return `+${result}`
  }

  return result
}

export function formatDateRange (period?: Period) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function formatDate(date: string | Date | undefined): string {
    if (!date) {
      return "";
    }

    let zonedDate: Date;
    if (typeof date === "string") {
      // Assume the string is in ISO format (UTC)
      zonedDate = toZonedTime(parseISO(date), userTimeZone);
    } else {
      // If it's a Date object, convert it to zoned time
      zonedDate = toZonedTime(date, userTimeZone);
    }

    return format(zonedDate, "LLL dd, yyyy");
  }

  const now = new Date();
  const defaultTo = now;
  const defaultFrom = subDays(now, 30);

  if (!period || (!period.from && !period.to)) {
    return `${formatDate(defaultFrom)} - ${formatDate(defaultTo)}`;
  }

  const fromDate = formatDate(period.from);
  const toDate = formatDate(period.to);

  if (fromDate && toDate) {
    return `${fromDate} - ${toDate}`;
  } else if (fromDate) {
    return fromDate;
  } else if (toDate) {
    return toDate;
  }

  return `${formatDate(defaultFrom)} - ${formatDate(defaultTo)}`;

}

export function calculatePercentageChange(
  current: number,
  previous: number,
) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }

  return ((current - previous ) / previous) * 100
}

export function fillMissingDays(
  activeDays: {
    date: Date,
    income: number,
    expenses: number,
  }[],
  startDate: Date,
  endDate: Date,
) {

  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))

    if (found) {
      return found
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      }
    }
  })

  return transactionsByDay
}

type Period = {
  from: string | Date | undefined,
  to: string | Date | undefined,
}
