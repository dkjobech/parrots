import boto3
import requests
import os

AWS_REGION = os.environ["AWS_REGION"]
ECS_CLUSTER = os.environ["ECS_CLUSTER"]
ECS_SERVICE = os.environ["ECS_SERVICE"]
IONOS_API_KEY = os.environ["IONOS_API_KEY"]
IONOS_A_RECORD_ID = os.environ["IONOS_A_RECORD_ID"]
IONOS_DOMAIN = os.environ["IONOS_DOMAIN"]
EXPECTED_KEYWORD = os.environ.get("EXPECTED_KEYWORD", "")

def get_ionos_ip_with_debug():
    IONOS_DOMAIN = "your_domain_here"  # Replace with actual domain

    # Step 1: Build the URL
    url = f"https://dns.google/resolve?name={IONOS_DOMAIN}&type=A"
    print(f"Step 1 - Built URL: {url}")

    # Step 2: Make the request
    try:
        print(f"Step 2 - Making GET request to: {url}")
        response = requests.get(url, timeout=5)
        print(f"Step 3 - Response status code: {response.status_code}")
        print(f"Step 4 - Response headers: {dict(response.headers)}")
        print(f"Step 5 - Raw response text: {response.text}")

        # Step 3: Parse JSON
        print("Step 6 - Parsing JSON...")
        json_data = response.json()
        print(f"Step 7 - Parsed JSON: {json.dumps(json_data, indent=2)}")

        # Step 4: Extract Answer
        print("Step 8 - Extracting Answer...")
        if "Answer" in json_data:
            answers = json_data["Answer"]
            print(f"Step 9 - Found {len(answers)} answers: {answers}")

            if len(answers) > 0:
                first_answer = answers[0]
                print(f"Step 10 - First answer: {first_answer}")

                if "data" in first_answer:
                    ip_address = first_answer["data"]
                    print(f"Step 11 - Final IP address: {ip_address}")
                    return ip_address
                else:
                    print("ERROR: No 'data' field in first answer")
                    return None
            else:
                print("ERROR: Answer array is empty")
                return None
        else:
            print("ERROR: No 'Answer' field in response")
            return None

    except requests.exceptions.Timeout:
        print("ERROR: Request timed out after 5 seconds")
        return None
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Request failed: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to parse JSON: {e}")
        return None
    except KeyError as e:
        print(f"ERROR: Missing key in response: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Unexpected error: {e}")
        return None

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
        "Authorization": f"Bearer {IONOS_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {"content": new_ip}
    url = f"https://api.hosting.ionos.com/dns/v1/records/{IONOS_A_RECORD_ID}"
    resp = requests.patch(url, json=data, headers=headers)
    resp.raise_for_status()

def main():
    #current_ip = get_current_dns_ip()
    result = get_ionos_ip_with_debug()
    print(f"\nFINAL RESULT: {result}")
    return

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
