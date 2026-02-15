import { delay } from "@/lib/utils";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Restaurant {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
    categories: Category[];
    products: Product[];
}

const MOCK_RESTAURANTS: Restaurant[] = [
    {
        id: "1",
        name: "Burger King",
        description: "Le roi du burger",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
        rating: 4.5,
        deliveryTime: "20-30 min",
        deliveryFee: 2.99,
        categories: [
            { id: "c1", name: "Burgers" },
            { id: "c2", name: "Frites" },
            { id: "c3", name: "Boissons" },
        ],
        products: [
            {
                id: "p1",
                name: "Whopper",
                description: "Le célèbre burger avec une viande grillée à la flamme.",
                price: 6.50,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                categoryId: "c1"
            },
            {
                id: "p2",
                name: "Steakhouse",
                description: "Un burger premium avec du bacon et une sauce barbecue.",
                price: 8.50,
                image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
                categoryId: "c1"
            },
            {
                id: "p3",
                name: "Frites Moyennes",
                description: "Des frites dorées et croustillantes.",
                price: 3.00,
                image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80",
                categoryId: "c2"
            }
        ]
    },
    {
        id: "2",
        name: "Sushi Shop",
        description: "Japonais, Sushi, Maki",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        rating: 4.7,
        deliveryTime: "30-45 min",
        deliveryFee: 3.99,
        categories: [
            { id: "c4", name: "Sushi" },
            { id: "c5", name: "Maki" },
            { id: "c6", name: "Plateaux" },
        ],
        products: [
            {
                id: "p4",
                name: "Salmon Sushi",
                description: "Riz vinaigré et saumon frais.",
                price: 4.50,
                image: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=800&q=80",
                categoryId: "c4"
            },
            {
                id: "p5",
                name: "California Roll",
                description: "Avocat, concombre et surimi.",
                price: 5.50,
                image: "https://images.unsplash.com/photo-1558985250-27a406d64cb3?w=800&q=80",
                categoryId: "c5"
            }
        ]
    },
    {
        id: "3",
        name: "Pizza Hut",
        description: "Pizzas américaines",
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80",
        rating: 4.2,
        deliveryTime: "25-40 min",
        deliveryFee: 1.49,
        categories: [
            { id: "c7", name: "Pizzas" },
            { id: "c8", name: "Entrées" },
        ],
        products: [
            {
                id: "p6",
                name: "Pepperoni Lover's",
                description: "Double pepperoni et mozzarella.",
                price: 12.00,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
                categoryId: "c7"
            }
        ]
    }
];

export const restaurantService = {
    getRestaurants: async (): Promise<Restaurant[]> => {
        await delay(500); // Simulate network latency
        return MOCK_RESTAURANTS;
    },

    getRestaurantById: async (id: string): Promise<Restaurant | undefined> => {
        await delay(300);
        return MOCK_RESTAURANTS.find(r => r.id === id);
    },

    getProductsByRestaurant: async (restaurantId: string): Promise<Product[]> => {
        await delay(300);
        const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
        return restaurant ? restaurant.products : [];
    }
};
