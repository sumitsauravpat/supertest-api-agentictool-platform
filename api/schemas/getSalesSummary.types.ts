export interface ResponseDetailsResponse {
  successInd: boolean;
  status: number;
  bffAlerts?: {
    code: string;
    message: string;
  }[];
  data: {
    referenceId: string;
    planSummary: {
      state: string;
      planSummaryItems: {
        quoteItemId: string;
        dueTodayAmount: number;
        dueMonthlyAmount: number;
      }[];
    };
  };
}
