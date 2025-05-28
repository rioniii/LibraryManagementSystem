import unittest
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_chrome_options():
    options = Options()
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--allow-insecure-localhost")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    return options

class TestEditRandomLoan(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(options=setup_chrome_options())
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.maximize_window()

    def login_as_admin(self):
        self.driver.get("https://localhost:5173/login")
        self.wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("ubejdaliu521@gmail.com")
        self.driver.find_element(By.NAME, "password").send_keys("Omeraliu12.")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/dashboard')]")))
        time.sleep(1)

    def go_to_book_loans(self):
        self.driver.get("https://localhost:5173/dashboard/loans")
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h4[contains(text(),'Manage Book Loans')]")))
        time.sleep(2)

    def edit_random_fine(self):
        rows = self.driver.find_elements(By.XPATH, "//table//tbody/tr")
        self.assertTrue(rows, "❌ Asnjë huazim nuk u gjet për editim.")

        row = random.choice(rows)
        edit_btn = row.find_element(By.XPATH, ".//button[contains(text(), 'Edit')]")
        self.driver.execute_script("arguments[0].scrollIntoView(true);", edit_btn)
        self.driver.execute_script("arguments[0].click();", edit_btn)

        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),'Edit Book Loan')]")))
        time.sleep(1)

        # Gjen inputin për Fine Amount dhe vendos një shumë të re
        fine_input = self.wait.until(EC.presence_of_element_located((By.NAME, "fineAmount")))
        new_amount = round(random.uniform(0.5, 20.0), 2)
        fine_input.clear()
        fine_input.send_keys(str(new_amount))

        save_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Save Changes')]")))
        self.driver.execute_script("arguments[0].click();", save_btn)

        time.sleep(2)
        print(f"✅ Një gjobë e re u vendos me sukses: ${new_amount}")

    def test_edit_bookloan_fine(self):
        print("➡️  Po kyçemi si admin...")
        self.login_as_admin()
        print("➡️  Po shkojmë në faqen e huazimeve...")
        self.go_to_book_loans()
        print("➡️  Po editojmë një huazim të rastësishëm...")
        self.edit_random_fine()

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
