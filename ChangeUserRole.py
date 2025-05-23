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

chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--allow-insecure-localhost')

driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. Log in as admin
    driver.get(f"{BASE_URL}/login")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(ADMIN_EMAIL)
    driver.find_element(By.NAME, "password").send_keys(ADMIN_PASSWORD)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
    WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))

    # 2. Go to users management page
    driver.get(f"{BASE_URL}/dashboard/users")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))

    # 3. Find a user with role "User"
    rows = driver.find_elements(By.XPATH, "//tr[td[contains(text(), 'User')]]")
    if not rows:
        print("No user with role 'User' found.")
        driver.quit()
        exit()

    user_row = rows[0]  # Take the first user with role "User"
    username = user_row.find_elements(By.TAG_NAME, "td")[0].text
    print(f"Changing role for user: {username}")

    # 4. Change their role to Admin using the MUI Select and assign button

    # Try to find any element with role="button" in the row
    actions_cell = user_row.find_elements(By.TAG_NAME, "td")[-1]
    print(actions_cell.get_attribute('innerHTML'))
    buttons = actions_cell.find_elements(By.XPATH, ".//*")
    for btn in buttons:
        print(btn.get_attribute('outerHTML'))

    if buttons:
        select_button = buttons[0]
        select_button.click()
        time.sleep(0.5)
        admin_option = driver.find_element(By.XPATH, "//li[normalize-space(text())='Admin']")
        admin_option.click()
    else:
        print("No select button found in the row.")
        driver.quit()
        exit()

    # Click the Assign button
    assign_button = user_row.find_element(By.XPATH, ".//button[contains(text(), 'Assign')]")
    assign_button.click()

    # 5. Wait for the Snackbar or for the role to update in the table
    time.sleep(2)  # Wait for the UI to update
    driver.refresh()
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    updated_rows = driver.find_elements(By.XPATH, f"//tr[td[contains(text(), '{username}')]]")
    if updated_rows:
        updated_role = updated_rows[0].find_elements(By.TAG_NAME, "td")[5].text  # 6th column is Role
        if "Admin" in updated_role:
            print(f"Test passed: User '{username}' role changed to Admin.")
        else:
            print(f"Test failed: User '{username}' role is still '{updated_role}'.")
    else:
        print("Test failed: User row not found after update.")

finally:
    time.sleep(2)
    driver.quit()