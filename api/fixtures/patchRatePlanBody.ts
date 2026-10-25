import { serviceValues } from "./serviceValues";
import { generateTestIds } from "../test-data/generateTestIds";

const testIds = generateTestIds();

// Purpose — real request body shape for patchRatePlan, real IDs come from the gitignored serviceValues lookup
export const patchRatePlanBody = {
  planItems: [
    {
      businessGroupId: serviceValues.businessGroupId,
      offeringId: serviceValues.defaultOffering,
      marketingBundleId: serviceValues.marketingBundleId,
      action: "PATCH",
      planTerm: "Monthly",
      productInventoryInstanceId: "",
      addressQualificationId: "",
    },
  ],
  referenceId: "",
  billingAccountNumber: testIds.billingAccountNumber,
  distributionChannelId: serviceValues.defaultChannel,
  customerCategoryId: serviceValues.defaultCategory,
  brandName: serviceValues.brandName,
  marketId: serviceValues.marketId,
  customerId: testIds.customerId,
  mobileServiceList: "",
  homeServiceList: "",
  channelInfo: {
    role: "User",
    channelContributionCode: "",
    orgTypeCode: "DL",
    orgInternalId: serviceValues.orgInternalId,
    orgNumber: serviceValues.orgNumber,
    outletProvinces: ["ON"],
    loginId: serviceValues.loginId,
    repId: serviceValues.repId,
    repInternalId: serviceValues.repInternalId,
    repOutlets: [
      {
        outletInternalId: serviceValues.outletInternalId,
        outletId: serviceValues.outletId,
      },
    ],
    repLanguage: "EN",
    assistedChannel: true,
  },
  apiVersionName: "active",
  extendedParameters: { preAuthorizedPaymentMethod: ["PAC"] },
  productFamilyName: "Mobility",
  multiCartInd: false,
};
