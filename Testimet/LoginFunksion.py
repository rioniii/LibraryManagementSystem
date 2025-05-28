from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--allow-insecure-localhost")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

# Start the driver
driver = webdriver.Chrome(options=chrome_options)

try:
    # Open the login page directly
    print("Opening login page...")
    driver.get("https://localhost:5173/login")
    
    # Wait for the page to load
    wait = WebDriverWait(driver, 20)
    
    # Wait for the login form to be present
    print("Waiting for login form...")
    username_field = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='email']")))
    print("Found email field")
    password_field = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='password']")))
    print("Found password field")
    login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
    print("Found login button")

    # Enter credentials
    print("Entering email...")
    username_field.send_keys("ubejdaliu@gmail.com")
    time.sleep(1)  # Wait to see the email being typed
    print("Entering password...")
    password_field.send_keys("Omeraliu12.")
    time.sleep(1)  # Wait to see the password being typed

    # Click the login button
    print("Clicking login button...")
    login_button.click()

    # Wait for navigation to complete
    print("Waiting for login process to complete...")
    time.sleep(3)  # Increased wait time to see the process
    
    # Verify login was successful
    current_url = driver.current_url
    print(f"Current URL after login: {current_url}")
    assert "login" not in current_url.lower(), "Login failed! Still on login page"
    print("Login successful!")
    
    # Wait a bit more to see the result
    print("Waiting to see the result...")
    time.sleep(2)

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    print("Closing browser...")
    driver.quit()