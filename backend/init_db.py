import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection configuration
MONGODB_URL = "mongodb://localhost:27017"
DB_NAME = "testdatabase"


async def init_db():
    # Create a database client
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    try:
        # Drop existing collections to start fresh
        await db.items.drop()

        # Sample items to insert
        sample_items = [
            {
                "name": "Laptop",
                "description": "High-performance laptop with 16GB RAM",
                "price": 999.99,
                "quantity": 10,
                "created_at": datetime.utcnow(),
            },
            {
                "name": "Smartphone",
                "description": "Latest model with 5G capability",
                "price": 699.99,
                "quantity": 15,
                "created_at": datetime.utcnow(),
            },
            {
                "name": "Headphones",
                "description": "Wireless noise-canceling headphones",
                "price": 199.99,
                "quantity": 20,
                "created_at": datetime.utcnow(),
            },
            {
                "name": "Tablet",
                "description": "10-inch tablet with stylus support",
                "price": 449.99,
                "quantity": 8,
                "created_at": datetime.utcnow(),
            },
        ]

        # Insert sample items
        result = await db.items.insert_many(sample_items)
        print(f"Successfully inserted {len(result.inserted_ids)} items")

        # Create indexes
        await db.items.create_index("name")
        await db.items.create_index("price")
        print("Created indexes on 'name' and 'price' fields")

        # Verify the data
        count = await db.items.count_documents({})
        print(f"Total documents in collection: {count}")

        print("Database initialization completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    # Run the initialization script
    asyncio.run(init_db())
