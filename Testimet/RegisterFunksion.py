from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
import time
import random
import string
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def generate_random_email():
    """Generate a random email for testing"""
    username = ''.join(random.choices(string.ascii_lowercase, k=8))
    return f"{username}@test.com"

def generate_random_password():
    """Generate a random password that meets requirements"""
    # Password requirements: at least 6 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    lowercase = ''.join(random.choices(string.ascii_lowercase, k=4))
    uppercase = ''.join(random.choices(string.ascii_uppercase, k=1))
    numbers = ''.join(random.choices(string.digits, k=1))
    special = ''.join(random.choices('!@#$%^&*', k=1))
    return f"{lowercase}{uppercase}{numbers}{special}"

def setup_chrome_options():
    """Configure Chrome options with all necessary settings"""
    chrome_options = Options()
    chrome_options.add_argument("--ignore-certificate-errors")
    chrome_options.add_argument("--allow-insecure-localhost")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-logging")
    chrome_options.add_argument("--log-level=3")
    chrome_options.add_argument("--silent")
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    return chrome_options

def wait_for_element(driver, by, value, timeout=20, description="element"):
    """Wait for an element to be present and return it"""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
        logger.info(f"Found {description}")
        return element
    except TimeoutException:
        logger.error(f"Timeout waiting for {description}")
        raise

def register_user(driver, wait, test_email, test_password, test_first_name, test_last_name):
    """Register a new user"""
    logger.info("Starting registration process...")
    driver.get("https://localhost:5173/register")
    time.sleep(2)

    # Fill in registration form
    first_name_field = wait_for_element(driver, By.NAME, "firstName", description="First Name field")
    first_name_field.clear()
    first_name_field.send_keys(test_first_name)
    time.sleep(1)

    last_name_field = wait_for_element(driver, By.NAME, "lastName", description="Last Name field")
    last_name_field.clear()
    last_name_field.send_keys(test_last_name)
    time.sleep(1)

    email_field = wait_for_element(driver, By.NAME, "email", description="Email field")
    email_field.clear()
    email_field.send_keys(test_email)
    time.sleep(1)

    password_field = wait_for_element(driver, By.NAME, "password", description="Password field")
    password_field.clear()
    password_field.send_keys(test_password)
    time.sleep(1)

    # Click register button
    register_button = wait_for_element(driver, By.CSS_SELECTOR, "button[type='submit']", description="Register button")
    register_button.click()
    time.sleep(3)

    # Verify registration
    current_url = driver.current_url
    if "register" not in current_url.lower():
        logger.info("Registration successful!")
        return True
    else:
        logger.error("Registration failed!")
        return False

def login_user(driver, wait, email, password):
    """Login with the registered user"""
    logger.info("Starting login process...")
    driver.get("https://localhost:5173/login")
    time.sleep(2)

    # Fill in login form
    email_field = wait_for_element(driver, By.NAME, "email", description="Email field")
    email_field.clear()
    email_field.send_keys(email)
    time.sleep(1)

    password_field = wait_for_element(driver, By.NAME, "password", description="Password field")
    password_field.clear()
    password_field.send_keys(password)
    time.sleep(1)

    # Click login button
    login_button = wait_for_element(driver, By.CSS_SELECTOR, "button[type='submit']", description="Login button")
    login_button.click()
    time.sleep(3)

    # Verify login
    current_url = driver.current_url
    if "login" not in current_url.lower():
        logger.info("Login successful!")
        return True
    else:
        logger.error("Login failed!")
        return False

def main():
    driver = None
    try:
        # Setup Chrome driver
        logger.info("Setting up Chrome driver...")
        driver = webdriver.Chrome(options=setup_chrome_options())
        wait = WebDriverWait(driver, 20)

        # Generate test data
        test_email = generate_random_email()
        test_password = generate_random_password()
        test_first_name = "Test"
        test_last_name = "User"

        logger.info("Generated test data:")
        logger.info(f"Email: {test_email}")
        logger.info(f"Password: {test_password}")
        logger.info(f"First Name: {test_first_name}")
        logger.info(f"Last Name: {test_last_name}")

        # Register new user
        if register_user(driver, wait, test_email, test_password, test_first_name, test_last_name):
            # Login with the registered user
            if login_user(driver, wait, test_email, test_password):
                logger.info("Test completed successfully!")
                # Keep the browser open for a while to see the result
                time.sleep(5)
            else:
                logger.error("Login failed")
        else:
            logger.error("Registration failed, skipping login")

    except WebDriverException as e:
        logger.error(f"WebDriver error occurred: {str(e)}")
        if driver:
            logger.error(f"Current URL: {driver.current_url}")
            logger.error(f"Page source: {driver.page_source}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        if driver:
            logger.error(f"Current URL: {driver.current_url}")
            logger.error(f"Page source: {driver.page_source}")
    finally:
        if driver:
            logger.info("Closing browser...")
            driver.quit()

if __name__ == "__main__":
    main()