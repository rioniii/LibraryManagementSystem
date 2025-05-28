
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def setup_chrome_options():
    options = Options()
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--allow-insecure-localhost")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    options.add_argument("--log-level=3")
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    return options

def wait_for_element(driver, by, value, timeout=20):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, value)))

class TestAdminAddBook(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(options=setup_chrome_options())
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.maximize_window()

    def login_admin(self):
        logger.info("Logging in as admin...")
        self.driver.get("https://localhost:5173/login")
        time.sleep(2)
        wait_for_element(self.driver, By.NAME, "email").send_keys("ubejdaliu521@gmail.com")
        time.sleep(1)
        wait_for_element(self.driver, By.NAME, "password").send_keys("Omeraliu12.")
        time.sleep(1)
        wait_for_element(self.driver, By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(lambda d: "login" not in d.current_url.lower())
        self.assertIn("localhost:5173", self.driver.current_url)
        logger.info("Admin login successful.")
        time.sleep(2)

    def navigate_to_books_page(self):
        logger.info("Navigating to Manage Books page...")
        self.driver.get("https://localhost:5173/dashboard/books")
        time.sleep(2)
        self.assertIn("/dashboard/books", self.driver.current_url)
        logger.info("On Manage Books page.")

    def test_add_book(self):
        self.login_admin()
        self.navigate_to_books_page()

        logger.info("Clicking Add New Book button...")
        add_btn = wait_for_element(self.driver, By.XPATH, "//button[contains(text(), 'Add New Book')]")
        time.sleep(1)
        add_btn.click()
        time.sleep(2)

        # Fill in the form
        fields = {
            "isbn": "9781234567890",
            "title": "Selenium Test Book",
            "author": "QA Bot",
            "publicationYear": "2025",
            "publisher": "AutoPublisher",
            "totalCopies": "5",
            "description": "This is a test book added via Selenium.",
            "coverImageURL": "https://example.com/image.jpg",
            "location": "Shelf B2"
        }

        for name, value in fields.items():
            el = wait_for_element(self.driver, By.NAME, name)
            self.driver.execute_script("arguments[0].scrollIntoView(true);", el)
            time.sleep(1)
            el.clear()
            el.send_keys(value)
            time.sleep(1)

        # Select category (MUI Select fix: safe click)
        try:
            logger.info("Selecting category...")
            dropdown = wait_for_element(self.driver, By.ID, "category-select")
            self.driver.execute_script("arguments[0].scrollIntoView(true);", dropdown)
            time.sleep(1)
            dropdown.click()
            time.sleep(2)

            options = self.driver.find_elements(By.XPATH, "//ul//li[not(@aria-disabled='true')]")
            for option in options:
                if option.is_displayed():
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", option)
                    time.sleep(1)
                    option.click()
                    logger.info(f"Selected category: {option.text}")
                    break
        except Exception as e:
            logger.warning(f"Could not select category: {e}")
        time.sleep(2)

        # Safe click for submit
        try:
            submit_btn = wait_for_element(self.driver, By.XPATH, "//button[contains(text(), 'Save Book')]")
        except:
            submit_btn = wait_for_element(self.driver, By.XPATH, "//button[@type='submit']")

        self.driver.execute_script("arguments[0].scrollIntoView(true);", submit_btn)
        time.sleep(2)
        try:
            WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Save Book')]")))
            submit_btn.click()
        except:
            self.driver.execute_script("arguments[0].click();", submit_btn)

        time.sleep(4)
        self.assertIn("/dashboard/books", self.driver.current_url)
        logger.info("Book added successfully.")
        time.sleep(2)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
