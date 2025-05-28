from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configuration
BASE_URL = "https://localhost:5173"
ADMIN_EMAIL = "rionhoxha123@gmail.com"
ADMIN_PASSWORD = "Bukurieaxhanela1;"
NAME = "Selenium Test"
EMAIL = "selenium@example.com"
SUBJECT = "Automated Test"
MESSAGE = "This is a test message sent by Selenium."

# Setup Chrome options to ignore certificate errors
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--allow-insecure-localhost')

driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. Go to Contact Us page
    driver.get(f"{BASE_URL}/contact")

    # 2. Fill in the form fields
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "name"))).send_keys(NAME)
    driver.find_element(By.NAME, "email").send_keys(EMAIL)
    driver.find_element(By.NAME, "subject").send_keys(SUBJECT)
    driver.find_element(By.NAME, "message").send_keys(MESSAGE)

    # 3. Click the "Send Message" button
    driver.find_element(By.XPATH, "//button[contains(text(), 'Send Message')]").click()

    # 4. Wait for the success Snackbar or message
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Message sent successfully!')]"))
    )
    print("Contact form submitted and success message appeared.")

    # 5. Go to login page
    driver.get(f"{BASE_URL}/login")

    # 6. Log in as admin
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(ADMIN_EMAIL)
    driver.find_element(By.NAME, "password").send_keys(ADMIN_PASSWORD)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()

    # 7. Wait for redirect to home page after login
    WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))

    # 8. Go to the admin dashboard page where contact submissions are listed
    # Adjust the URL if your admin contact submissions are elsewhere
    driver.get(f"{BASE_URL}/dashboard")

    # 9. Wait for the contact submissions table to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//table"))
    )

    # 10. Check if the new submission appears (by subject)
    rows = driver.find_elements(By.XPATH, f"//tr[td[contains(text(), '{SUBJECT}')]]")
    if rows:
        print("Test passed: Contact submission is visible in the admin dashboard.")
    else:
        print("Test failed: Contact submission not found in the admin dashboard.")

finally:
    time.sleep(2)  # Optional: to see the result before closing
    driver.quit()
