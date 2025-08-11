import boto3
import requests
import os
import json

AWS_REGION = os.environ["AWS_REGION"]
ECS_CLUSTER = os.environ["ECS_CLUSTER"]
ECS_SERVICE = os.environ["ECS_SERVICE"]
IONOS_API_KEY = os.environ["IONOS_API_KEY"]
IONOS_A_RECORD_ID = os.environ["IONOS_A_RECORD_ID"]
IONOS_DOMAIN = os.environ["IONOS_DOMAIN"]
EXPECTED_KEYWORD = os.environ.get("EXPECTED_KEYWORD", "")

def get_current_dns_ip():
    try:
        r = requests.get(
            f"https://dns.google/resolve?name={IONOS_DOMAIN}&type=A", timeout=5
        ).json()
        return r["Answer"][0]["data"]
    except Exception as e:
        raise RuntimeError(f"Failed to get current DNS IP: {e}")

def site_ok(ip):
    try:
        r = requests.get(f"http://{ip}", timeout=5)
        return EXPECTED_KEYWORD in r.text
    except Exception:
        return False

def get_fargate_public_ip():
    ecs = boto3.client("ecs", region_name=AWS_REGION)
    ec2 = boto3.client("ec2", region_name=AWS_REGION)

    tasks = ecs.list_tasks(cluster=ECS_CLUSTER, serviceName=ECS_SERVICE)
    if not tasks["taskArns"]:
        raise RuntimeError("No running ECS tasks found")

    task_desc = ecs.describe_tasks(cluster=ECS_CLUSTER, tasks=tasks["taskArns"])
    eni_id = task_desc["tasks"][0]["attachments"][0]["details"][1]["value"]

    eni_desc = ec2.describe_network_interfaces(NetworkInterfaceIds=[eni_id])
    return eni_desc["NetworkInterfaces"][0]["Association"]["PublicIp"]

def update_ionos_dns(new_ip):
    headers = {
        "X-API-Key": IONOS_API_KEY,
        "Content-Type": "application/json"
    }
    data = {"content": new_ip}
    url = f"https://api.hosting.ionos.com/dns/v1/zones/deepwatertechnologies.com/records/{IONOS_A_RECORD_ID}"
    resp = requests.patch(url, json=data, headers=headers)
    resp.raise_for_status()

def main():
    current_ip = get_current_dns_ip()

    if site_ok(current_ip):
        print(f"✅ Site is fine at {current_ip} — no update needed.")
        return

    print(f"⚠️ Site failed check at {current_ip}. Fetching new ECS IP...")
    new_ip = get_fargate_public_ip()
    if new_ip == current_ip:
        print(f"ℹ️ ECS still shows same IP {new_ip} — possible site outage.")
        return

    print(f"🔄 Updating IONOS A record to {new_ip}")
    update_ionos_dns(new_ip)
    print(f"✅ DNS updated to {new_ip}")

if __name__ == "__main__":
    main()
