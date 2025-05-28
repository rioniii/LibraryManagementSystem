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
CATEGORY_NAME = "Selenium Test Category"
CATEGORY_DESCRIPTION = "This category was added by Selenium automated test."

chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--allow-insecure-localhost')

driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. Go to login page
    driver.get(f"{BASE_URL}/login")

    # 2. Log in as admin
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(ADMIN_EMAIL)
    driver.find_element(By.NAME, "password").send_keys(ADMIN_PASSWORD)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()

    # 3. Wait for redirect to home page after login
    WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))

    # 4. Go to the categories management page
    driver.get(f"{BASE_URL}/dashboard/categories")

    # 5. Wait for the "Add New Category" button and click it
    add_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add New Category')]"))
    )
    add_button.click()

    # 6. Wait for the category name input to appear and fill it in
    category_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "name"))
    )
    category_input.send_keys(CATEGORY_NAME)

    # 7. Fill in the description field
    description_input = driver.find_element(By.NAME, "description")
    description_input.send_keys(CATEGORY_DESCRIPTION)

    # 8. Click the "Add Category" button in the dialog/form
    save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Add Category')]")
    save_button.click()

    # 9. Wait for the category to appear in the list/table
    time.sleep(2)  # Wait for the list to update
    rows = driver.find_elements(By.XPATH, f"//tr[td[contains(text(), '{CATEGORY_NAME}')] and td[contains(text(), '{CATEGORY_DESCRIPTION}')]]")
    if rows:
        print("Test passed: Category with description was added and is visible in the list.")
    else:
        print("Test failed: Category with description was not found in the list.")

finally:
    time.sleep(2)  # Optional: to see the result before closing
    driver.quit()