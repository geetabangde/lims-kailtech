import { ArrowPathIcon, CheckBadgeIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const orderStatusOptions = [
    {
        value: 'shipping',
        label: 'Shipping',
        color: 'info',
        icon: TruckIcon
    },
    {
        value: 'pending',
        label: 'Pending',
        color: 'warning',
        icon: ClockIcon
    },
    {
        value: 'completed',
        label: 'Completed',
        color: 'success',
        icon: CheckBadgeIcon
    },
    {
        value: 'processing',
        label: 'Processing',
        color: 'primary',
        icon: ArrowPathIcon
    },
    {
        value: 'cancelled',
        label: 'Cancelled',
        color: 'error',
        icon: XCircleIcon
    }
]

export const ordersList = [
    {
        order_id: "#63858",
        created_at: "1676070562000",
        customer: {
            name: "Henka Scanes",
            avatar_img: null,
        },
        total: 944.82,
        profit: 415.7208,
        payment_status: "paid",
        order_status: "shipping",
        shipping_address: { street: "6 Algoma Crossing", line: "PO Box 92517" },
        products: [
            {
                name: "Salmon - Whole, 4 - 6 Pounds",
                sku: 58988,
                image: "/images/800x600.png",
                price: 280.65,
                qty: 1,
                discount: 0.52,
                total: 235.58,            },
            {
                name: "Veal - Shank, Pieces",
                sku: 44640,
                image: "/images/800x600.png",
                price: 59.77,
                qty: 3,
                discount: 0.45,
                total: 946.77,
            },
            {
                name: "Calypso - Pineapple Passion",
                sku: 27758,
                image: "/images/800x600.png",
                price: 771.2,
                qty: 6,
                discount: 0.5,
                total: 182.33,
            },
            
        ],
        subtotal: 24.74,
        delivery_fee: 86.62,
        tax: 20,
        total_amount_due: 866.51,
    }
]
