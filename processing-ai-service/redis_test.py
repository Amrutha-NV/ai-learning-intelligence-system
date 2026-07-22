from src.config.redis import redis_client


print("Checking Redis connection...")

print("PING:", redis_client.ping())

redis_client.set("project_name", "AI Learning Intelligence System")

value = redis_client.get("project_name")

print("Stored value:", value)