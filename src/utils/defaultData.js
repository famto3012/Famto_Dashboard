const itemTypes = [
  { label: "Documents & Parcels", value: "Documents & Parcels" },
  { label: "Food & Groceries", value: "Food & Groceries" },
  { label: "Clothing & Laundry", value: "Clothing & Laundry" },
  { label: "Medical Supplies", value: "Medical Supplies" },
  { label: "Personal Items", value: "Personal Items" },
  { label: "Gifts & Flowers", value: "Gifts & Flowers" },
  { label: "Electronics", value: "Electronics" },
  { label: "Household Items", value: "Household Items" },
  { label: "Books & Stationery", value: "Books & Stationery" },
  { label: "Online Orders", value: "Online Orders" },
  { label: "Pet Supplies", value: "Pet Supplies" },
  { label: "Automotive Parts", value: "Automotive Parts" },
  { label: "Others", value: "Others" },
];

const unitOptions = [
  { value: "gm", label: "gm" },
  { value: "kg", label: "kg" },
  { value: "ltr", label: "ltr" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
];

const orderStatusOption = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "On-going", label: "On-going" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const paymentModeOption = [
  { value: "all", label: "All" },
  { value: "Cash-on-delivery", label: "Pay on delivery" },
  { value: "Online-payment", label: "Online payment" },
  { value: "Famto-cash", label: "Famto cash" },
];

const deliveryModeOption = [
  { value: "all", label: "All" },
  { value: "Home Delivery", label: "Home Delivery" },
  { value: "Take Away", label: "Take Away" },
  { value: "Pick and Drop", label: "Pick and Drop" },
  { value: "Custom Order", label: "Custom Order" },
];

const serviceableOptions = [
  { value: "all", label: "All" },
  { value: "true", label: "Open" },
  { value: "false", label: "Closed" },
];

const userTypeOptions = [
  { value: "customer", label: "Customer" },
  { value: "agent", label: "Agent" },
  { value: "merchant", label: "Merchant" },
];

const userTypeForPushNotificationOptions = [
  { value: "customer", label: "Customer" },
  { value: "driver", label: "Agent" },
  { value: "merchant", label: "Merchant" },
];

const agentStatusOptions = [
  { value: "all", label: "All" },
  { value: "Free", label: "Free" },
  { value: "Busy", label: "Busy" },
  { value: "Inactive", label: "Inactive" },
];

const agentDeliveryManagementStatusOptions = [
  { value: "Free", label: "Free" },
  { value: "Busy", label: "Busy" },
  { value: "Inactive", label: "Inactive" },
];

const agentVehicleOptions = [
  { value: "all", label: "All" },
  { value: "Bike", label: "Bike" },
  { value: "Scooter", label: "Scooter" },
];

const accountLogsOptions = [
  { value: "Agent", label: "Agent" },
  { value: "Merchant", label: "Merchant" },
  { value: "Customer", label: "Customer" },
];

const payoutPaymentStatus = [
  { value: "all", label: "All" },
  { value: "true", label: "Paid" },
  { value: "false", label: "Un-paid" },
];

const vehicleTypeOptions = [
  { value: "Bike", label: "Bike" },
  { value: "Scooter", label: "Scooter" },
];

const agentTagOptions = [
  { value: "Normal", label: "Normal" },
  { value: "Fish & Meat", label: "Fish & Meat" },
];

const taskStatusOptions = [
  { value: "Unassigned", label: "Unassigned Tasks" },
  { value: "Assigned", label: "Assigned Tasks" },
  { value: "Completed", label: "Completed Tasks" },
  { value: "BatchOrders", label: "Batch Orders" },
];

const promoCodeModeOptions = [
  { value: "Public", label: "Public" },
  { value: "Hidden", label: "Hidden" },
];

const paymentOptions = [
  { value: "Online-payment", label: "Online payment" },
  { value: "Cash-on-delivery", label: "Pay on delivery" },
];

const subscriptionOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

const addNotificationSettingsOption = [
  { label: "New Order created", value: "newOrderCreated" },
  { label: "Order accepted", value: "orderAccepted" },
  { label: "Order rejected", value: "orderRejected" },
  { label: "Subscription plan end", value: "subscriptionPlanEnd" },
  {
    label: "Agent Order Accepted (For customer)",
    value: "agentOrderAccepted",
  },
  { label: "Agent Order Rejected (For Admin)", value: "agentOrderRejected" }, // TODO: Check if added notification
  { label: "Sponsorship plan expired", value: "sponsorshipPlanExpired" },
  {
    label: "Agent reached delivery Location",
    value: "reachedDeliveryLocation",
  },
  {
    label: "Agent reached pickup Location",
    value: "reachedPickupLocation",
  },
  {
    label: "Agent not reached pickup Location",
    value: "agentNotReachedPickupLocation",
  },
  {
    label: "Agent not reached delivery Location",
    value: "agentNotReachedDeliveryLocation",
  },
  {
    label: "Agent started delivery",
    value: "agentDeliveryStarted",
  },
  {
    label: "New order (Agent)",
    value: "newOrder",
  },
  {
    label: "Scheduled order created",
    value: "scheduledOrderCreated",
  },
  {
    label: "Order ready (Agent)",
    value: "orderReadyAgent",
  },
  {
    label: "Order ready (Customer)",
    value: "orderReadyCustomer",
  },
  {
    label: "Order completed",
    value: "orderCompleted",
  },
  {
    label: "Cancel custom Order By Agent",
    value: "cancelCustomOrderByAgent",
  },
];

const allowedRoutesOption = [
  {
    label: "Home",
    value: "/home",
  },
  {
    label: "Order",
    value: "/order",
  },
  {
    label: "Merchant",
    value: "/merchant",
  },
  {
    label: "Product",
    value: "/product",
  },
  {
    label: "Customer",
    value: "/customer",
  },
  {
    label: "Agent",
    value: "/agent",
  },
  {
    label: "Delivery management",
    value: "/delivery-management",
  },
  {
    label: "Commissions and Subscriptions",
    value: "/comm-and-subs",
  },
  {
    label: "Whatsapp",
    value: "/chat",
  },
  {
    label: "Discount",
    value: "/marketing/discount",
  },
  {
    label: "Banner",
    value: "/marketing/ad-banner",
  },
  {
    label: "Loyalty point",
    value: "/marketing/loyalty-point",
  },
  {
    label: "Promocode",
    value: "/marketing/promo-code",
  },
  {
    label: "Referral",
    value: "/marketing/referral",
  },
  {
    label: "Notification log",
    value: "/notification/logs",
  },
  {
    label: "Push notification",
    value: "/notification/push-notification",
  },
  {
    label: "Notification settings",
    value: "/notification/settings",
  },
  {
    label: "Alert notification",
    value: "/notification/alert-notification",
  },
  {
    label: "Managers",
    value: "/configure/managers",
  },
  {
    label: "Pricing",
    value: "/configure/pricing",
  },
  {
    label: "Tax",
    value: "/configure/tax",
  },
  {
    label: "Geofence",
    value: "/configure/geofence",
  },
  {
    label: "Customer app customization",
    value: "/customize/customer-app",
  },
  {
    label: "Agent app customization",
    value: "/customize/agent-app",
  },
  {
    label: "Merchant app customization",
    value: "/customize/merchant-app",
  },
  {
    label: "Activity log",
    value: "/account/activity-logs",
  },
  {
    label: "Account log",
    value: "/account/account-logs",
  },
];

const allowedMerchantRouteOptions = [
  {
    label: "Home",
    value: "/home",
  },
  {
    label: "Order",
    value: "/order",
  },
  {
    label: "Product",
    value: "/product",
  },
  {
    label: "Customer",
    value: "/customer",
  },
  {
    label: "Commissions and Subscriptions",
    value: "/comm-and-subs",
  },
  {
    label: "Notification log",
    value: "/notification/logs",
  },
  {
    label: "Settings",
    value: "/account/settings",
  },
];

const mainSideBarMenuItems = [
  {
    to: "/home",
    iconName: "HomeIcon",
    label: "Home",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/order",
    iconName: "BookIcon",
    label: "Orders",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/merchant",
    iconName: "ShopIcon",
    label: "Merchants",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/product",
    iconName: "ProductIcon",
    label: "Products",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/customer",
    iconName: "UsersIcon",
    label: "Customers",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/agent",
    iconName: "AgentIcon",
    label: "Delivery Agents",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/delivery-management",
    iconName: "BikeIcon",
    label: "Delivery Management",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/comm-and-subs",
    iconName: "PercentageIcon",
    label: "Commission/Subscription",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/chat",
    iconName: "WhatsappIcon",
    label: "Whatsapp",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/marketing/discount",
    iconName: "GiftIcon",
    label: "Discount",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Marketing",
  },
  {
    to: "/marketing/ad-banner",
    iconName: "AdBannerIcon",
    label: "Ad banner",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Marketing",
  },
  {
    to: "/marketing/loyalty-point",
    iconName: "LoyaltyPointIcon",
    label: "Loyalty Point",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Marketing",
  },
  {
    to: "/marketing/promo-code",
    iconName: "PromoCodeIcon",
    label: "Promo code",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Marketing",
  },
  {
    to: "/marketing/referral",
    iconName: "ReferralIcon",
    label: "Referral",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Marketing",
  },
  {
    to: "/notification/logs",
    iconName: "NotificationIcon",
    label: "Notification log",
    roles: ["Admin", "Merchant"],
    dropDown: true,
    dropLabel: "Notification",
  },
  {
    to: "/notification/push-notification",
    iconName: "PushNotificationIcon",
    label: "Push Notification",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Notification",
  },
  {
    to: "/notification/settings",
    iconName: "NotificationSettingsIcon",
    label: "Notification Settings",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Notification",
  },
  {
    to: "/notification/alert-notification",
    iconName: "AlertNotificationIcon",
    label: "Alert Notification",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Notification",
  },
  {
    to: "/configure/managers",
    iconName: "ManagerIcon",
    label: "Managers",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Configure",
  },
  {
    to: "/configure/pricing",
    iconName: "PricingIcon",
    label: "Pricing",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Configure",
  },
  {
    to: "/configure/tax",
    iconName: "PercentageIcon",
    label: "Tax",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Configure",
  },
  {
    to: "/configure/geofence",
    iconName: "GeofenceIcon",
    label: "Geofence",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Configure",
  },
  {
    to: "/customize/customer-app",
    iconName: "CustomizationIcon",
    label: "Customer App",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "App Customization",
  },
  {
    to: "/customize/agent-app",
    iconName: "CustomizationIcon",
    label: "Agent App",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "App Customization",
  },
  {
    to: "/customize/merchant-app",
    iconName: "CustomizationIcon",
    label: "Merchant App",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "App Customization",
  },
  {
    to: "/account/activity-logs",
    iconName: "ActivityIcon",
    label: "Activity log",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Account",
  },
  {
    to: "/account/account-logs",
    iconName: "AccountIcon",
    label: "Account logs",
    roles: ["Admin"],
    dropDown: true,
    dropLabel: "Account",
  },
  {
    to: "/account/settings",
    iconName: "SettingsIcon",
    label: "Settings",
    roles: ["Admin", "Merchant"],
    dropDown: true,
    dropLabel: "Account",
  },
];

const smallSideBarMenuItems = [
  {
    to: "/home",
    iconName: "HomeIcon",
    label: "Home",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/order",
    iconName: "BookIcon",
    label: "Orders",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/merchant",
    iconName: "ShopIcon",
    label: "Merchants",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/product",
    iconName: "ProductIcon",
    label: "Products",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/customer",
    iconName: "UsersIcon",
    label: "Customers",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
  {
    to: "/agent",
    iconName: "AgentIcon",
    label: "Delivery Agents",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/delivery-management",
    iconName: "BikeIcon",
    label: "Delivery Management",
    roles: ["Admin"],
    dropDown: false,
  },
  {
    to: "/comm-and-subs",
    iconName: "PercentageIcon",
    label: "Commission/Subscription",
    roles: ["Admin", "Merchant"],
    dropDown: false,
  },
];

const templateOptions = [
  {
    label: "Welcome template",
    value: "welcome_template",
  },
];

const appUpdateTypeOptions = [
  { label: "IMMEDIATE", value: "IMMEDIATE" },
  { label: "FLEXIBLE", value: "FLEXIBLE" },
];

const imageDisplayTypeOptions = [
  { label: "COVER", value: "cover" },
  { label: "CONTAIN", value: "contain" },
];

export {
  itemTypes,
  unitOptions,
  orderStatusOption,
  paymentModeOption,
  deliveryModeOption,
  serviceableOptions,
  agentStatusOptions,
  agentVehicleOptions,
  accountLogsOptions,
  payoutPaymentStatus,
  userTypeOptions,
  userTypeForPushNotificationOptions,
  vehicleTypeOptions,
  agentTagOptions,
  taskStatusOptions,
  promoCodeModeOptions,
  paymentOptions,
  agentDeliveryManagementStatusOptions,
  addNotificationSettingsOption,
  allowedRoutesOption,
  allowedMerchantRouteOptions,
  mainSideBarMenuItems,
  smallSideBarMenuItems,
  subscriptionOptions,
  templateOptions,
  appUpdateTypeOptions,
  imageDisplayTypeOptions,
};
