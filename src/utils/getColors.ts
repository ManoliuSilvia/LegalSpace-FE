import { CaseStatuses } from "./models";

export const getStatusColor = (status: CaseStatuses | string) => {
  switch (status) {
    case CaseStatuses.TAKEN:
      return "primary";
    case CaseStatuses.PENDING:
      return "warning";
    case CaseStatuses.COMPLETED:
      return "success";
    default:
      return "default";
  }
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "low":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};
