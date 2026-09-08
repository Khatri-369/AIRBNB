const sampleListings = [
    {
        title: "Cozy Beachfront Cottage",
        description:
            "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1500,
        location: "Malibu",
        country: "United States",
    },
    {
        title: "Modern Loft in Downtown",
        description:
            "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1200,
        location: "New York City",
        country: "United States",
    },
    {
        title: "Mountain Retreat",
        description:
            "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1000,
        location: "Aspen",
        country: "United States",
    },
    {
        title: "Historic Villa in Tuscany",
        description:
            "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
        image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 2500,
        location: "Florence",
        country: "Italy",
    },
    {
        title: "Secluded Treehouse Getaway",
        description:
            "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
        image: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 800,
        location: "Portland",
        country: "United States",
    },
    {
        title: "Beachfront Paradise",
        description:
            "Step out of your door onto the sandy beach. This beachfront home offers the ultimate relaxation.",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 2000,
        location: "Cancun",
        country: "Mexico",
    },
    {
        title: "Rustic Cabin by the Lake",
        description:
            "Spend your days fishing and kayaking on the serene lake. Return to this cozy wooden cabin in the evening.",
        image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 900,
        location: "Lake Tahoe",
        country: "United States",
    },
    {
        title: "Luxury Penthouse with City Views",
        description:
            "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 3500,
        location: "Los Angeles",
        country: "United States",
    },
    {
        title: "Ski-In/Ski-Out Chalet",
        description:
            "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 3000,
        location: "Verbier",
        country: "Switzerland",
    },
    {
        title: "Safari Lodge in the Serengeti",
        description:
            "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 4000,
        location: "Serengeti National Park",
        country: "Tanzania",
    },
    {
        title: "Historic Canal House",
        description:
            "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's historic center.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1800,
        location: "Amsterdam",
        country: "Netherlands",
    },
    {
        title: "Private Island Retreat",
        description:
            "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 10000,
        location: "Fiji",
        country: "Fiji",
    },
    {
        title: "Charming Cottage in the Cotswolds",
        description:
            "Escape to the English countryside in this quaint and charming cottage with a thatched roof.",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1200,
        location: "Cotswolds",
        country: "United Kingdom",
    },
    {
        title: "Historic Brownstone in Boston",
        description:
            "Step back in time in this elegant historic brownstone located in the historic Beacon Hill neighborhood.",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 2200,
        location: "Boston",
        country: "United States",
    },
    {
        title: "Beachfront Bungalow in Bali",
        description:
            "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1800,
        location: "Bali",
        country: "Indonesia",
    },
    {
        title: "Mountain View Cabin in Banff",
        description:
            "Enjoy breathtaking mountain views from this cozy cabin nestled in the Canadian Rockies.",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1500,
        location: "Banff",
        country: "Canada",
    },
    {
        title: "Art Deco Apartment in Miami",
        description:
            "Step into the glamour of the 1930s in this stylish Art Deco apartment in South Beach.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1600,
        location: "Miami",
        country: "United States",
    },
    {
        title: "Tropical Villa in Phuket",
        description:
            "Escape to a tropical paradise in this luxurious villa with a private infinity pool overlooking the ocean.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 3000,
        location: "Phuket",
        country: "Thailand",
    },
    {
        title: "Historic Castle in Scotland",
        description:
            "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
        image: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 4000,
        location: "Scottish Highlands",
        country: "United Kingdom",
    },
    {
        title: "Desert Oasis in Dubai",
        description:
            "Experience luxury in the middle of the desert in this opulent oasis with private pool and desert views.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 5000,
        location: "Dubai",
        country: "United Arab Emirates",
    },
    {
        title: "Rustic Log Cabin in Montana",
        description:
            "Unplug and reconnect with nature in this rustic log cabin surrounded by towering pine trees.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1100,
        location: "Montana",
        country: "United States",
    },
    {
        title: "Beachfront Villa in Greece",
        description:
            "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
        image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 2500,
        location: "Mykonos",
        country: "Greece",
    },
    {
        title: "Eco-Friendly Treehouse Retreat",
        description:
            "Stay in a sustainable treehouse nestled in a lush green rainforest canopy. An unforgettable nature getaway.",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 750,
        location: "Costa Rica",
        country: "Costa Rica",
    },
    {
        title: "Historic Cottage in Charleston",
        description:
            "Experience the charm of the South in this historic cottage with a private porch and garden.",
        image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1600,
        location: "Charleston",
        country: "United States",
    },
    {
        title: "Modern Apartment in Tokyo",
        description:
            "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 2000,
        location: "Tokyo",
        country: "Japan",
    },
    {
        title: "Lakefront Cabin in New Hampshire",
        description:
            "Spend your days by the lake in this charming cabin. Perfect for outdoor lovers and families.",
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1300,
        location: "New Hampshire",
        country: "United States",
    },
    {
        title: "Luxury Villa in the Maldives",
        description:
            "Indulge in an overwater villa experience with turquoise lagoon views and private deck access.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 6000,
        location: "Maldives",
        country: "Maldives",
    },
    {
        title: "Ski Chalet in Aspen",
        description:
            "Hit the slopes from this luxury ski chalet featuring heated floors and a stone fireplace.",
        image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 4000,
        location: "Aspen",
        country: "United States",
    },
    {
        title: "Secluded Beach House in Costa Rica",
        description:
            "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        price: 1800,
        location: "Costa Rica",
        country: "Costa Rica",
    },
];

module.exports = { data: sampleListings };