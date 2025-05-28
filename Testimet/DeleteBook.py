from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configuration
BASE_URL = "https://localhost:5173"  # Base URL only
ADMIN_EMAIL = "rionhoxha123@gmail.com"
ADMIN_PASSWORD = "Bukurieaxhanela1;"
BOOK_TITLE_TO_DELETE = "The Da Vinci Code"  # The title of the book you want to delete

# Setup Chrome options to ignore certificate errors
chrome_options = Options()
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--allow-insecure-localhost')

# Setup WebDriver (make sure chromedriver is in your PATH)
driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. Go to login page
    driver.get(f"{BASE_URL}/login")

    # 2. Wait for the email input to be present and log in
    email_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    email_input.send_keys(ADMIN_EMAIL)

    password_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )
    password_input.send_keys(ADMIN_PASSWORD)

    login_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign In')]"))
    )
    login_button.click()

    # 3. Wait for redirect to home page after login
    WebDriverWait(driver, 10).until(EC.url_to_be(f"{BASE_URL}/"))

    # Now go to the admin books page
    driver.get(f"{BASE_URL}/dashboard/books")

    # After login, go to books page and wait for it to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # 4. Find the book row by title
    book_row = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, f"//tr[td[contains(text(), '{BOOK_TITLE_TO_DELETE}')]]"))
    )

    # 5. Click the delete button in that row (adjust selector as needed)
    # If your delete button is an icon, you may need to use a different selector
    delete_button = book_row.find_element(By.TAG_NAME, "button")
    delete_button.click()

    # 6. Handle confirmation dialog if present
    try:
        confirm_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Delete')]"))
        )
        confirm_button.click()
    except:
        pass  # If no confirmation, continue

    # 7. Wait for deletion to complete and verify the book is gone
    time.sleep(2)  # Adjust as needed for your UI
    books = driver.find_elements(By.XPATH, f"//tr[td[contains(text(), '{BOOK_TITLE_TO_DELETE}')]]")
    if not books:
        print("Book deleted successfully.")
    else:
        print("Book was NOT deleted.")

finally:
    driver.quit()