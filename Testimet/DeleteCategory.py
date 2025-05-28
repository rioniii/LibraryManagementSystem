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

class TestDeleteRandomCategory(unittest.TestCase):
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

    def go_to_categories(self):
        self.driver.get("https://localhost:5173/dashboard/categories")
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Manage Categories')]")))
        time.sleep(2)

    def delete_random_category(self):
        rows = self.driver.find_elements(By.XPATH, "//table//tbody/tr")
        self.assertTrue(rows, "❌ Asnjë kategori nuk u gjet.")

        row = random.choice(rows)
        delete_button = row.find_element(By.XPATH, ".//button[contains(@aria-label, 'delete') or contains(@class, 'MuiIconButton-root')]")
        self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_button)
        self.driver.execute_script("arguments[0].click();", delete_button)

        alert = self.driver.switch_to.alert
        alert.accept()  # Confirm deletion
        time.sleep(2)

        print("✅ Një kategori e rastësishme u fshi me sukses.")

    def test_delete_category(self):
        print("➡️  Po kyçemi si admin...")
        self.login_as_admin()
        print("➡️  Po shkojmë te faqja e kategorive...")
        self.go_to_categories()
        print("➡️  Po fshijmë një kategori të rastësishme...")
        self.delete_random_category()

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
