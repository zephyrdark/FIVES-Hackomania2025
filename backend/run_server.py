import uvicorn


def run_server():
    print("Starting FastAPI Server with uvicorn...")
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,  # Enable auto-reload for development
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"\nError running server: {e}")
        input("Press Enter to exit...")


if __name__ == "__main__":
    run_server()
