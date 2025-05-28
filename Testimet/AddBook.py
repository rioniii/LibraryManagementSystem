
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

class TestBorrowBook(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(options=setup_chrome_options())
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.maximize_window()

    def login_user(self):
        logger.info("Logging in as normal user...")
        self.driver.get("https://localhost:5173/login")
        time.sleep(2)
        wait_for_element(self.driver, By.NAME, "email").send_keys("ubejdaliu@gmail.com")
        time.sleep(1)
        wait_for_element(self.driver, By.NAME, "password").send_keys("Omeraliu12.")
        time.sleep(1)
        wait_for_element(self.driver, By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(lambda d: "login" not in d.current_url.lower())
        self.assertIn("localhost:5173", self.driver.current_url)
        logger.info("Login successful.")
        time.sleep(2)

    def borrow_book_from_books_page(self):
        logger.info("Navigating to /books page...")
        self.driver.get("https://localhost:5173/books")
        time.sleep(3)

        borrow_btns = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Borrow Book')]")
        if borrow_btns:
            logger.info("Clicking Borrow Book on the first available book...")
            borrow_btns[0].click()
            time.sleep(2)

            # Confirm in dialog
            confirm_btn = wait_for_element(self.driver, By.XPATH, "//button[contains(text(), 'Confirm Borrow')]")
            confirm_btn.click()
            time.sleep(3)

            logger.info("Borrow action confirmed. Proceeding to verification.")
        else:
            self.fail("No Borrow Book buttons available")

    def verify_book_in_my_books(self):
        logger.info("Verifying book appears in My Books page...")
        self.driver.get("https://localhost:5173/my-books")
        time.sleep(2)

        book_row = self.driver.find_elements(By.CSS_SELECTOR, ".MuiTableBody-root .MuiTableRow-root")
        self.assertTrue(book_row, "No book rows found in My Books")
        logger.info("Borrowed book found in My Books.")

    def test_borrow_and_verify(self):
        self.login_user()
        self.borrow_book_from_books_page()
        self.verify_book_in_my_books()

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
