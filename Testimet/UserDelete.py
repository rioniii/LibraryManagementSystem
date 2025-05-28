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

class TestDeleteRegularUser(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(options=setup_chrome_options())
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.maximize_window()

    def login_as_admin(self):
        self.driver.get("https://localhost:5173/login")
        self.wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("ubejdaliu521@gmail.com")
        self.driver.find_element(By.NAME, "password").send_keys("Omeraliu12.")
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(lambda d: "login" not in d.current_url.lower())
        time.sleep(2)

    def go_to_user_manager(self):
        self.driver.get("https://localhost:5173/dashboard/users")
        self.wait.until(EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Manage Users')]")))
        time.sleep(2)

    def test_delete_regular_user(self):
        print("➡️  Kyçje si admin...")
        self.login_as_admin()
        print("➡️  Navigim te User Manager...")
        self.go_to_user_manager()

        rows = self.driver.find_elements(By.XPATH, "//table//tbody/tr")
        self.assertTrue(rows, "❌ Nuk u gjet asnjë përdorues në tabelë.")
        print(f"ℹ️ U gjetën {len(rows)} përdorues.")

        deleted = False
        for row in rows:
            try:
                cells = row.find_elements(By.TAG_NAME, "td")
                role = cells[5].text.strip().lower()
                if "admin" not in role and "user" in role:
                    print(f"🔍 Po provohet fshirja e: {cells[1].text.strip()} me rol: {role}")
                    delete_btn = row.find_element(By.XPATH, ".//button[contains(@class, 'MuiIconButton-root')]")
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_btn)
                    self.driver.execute_script("arguments[0].click();", delete_btn)
                    time.sleep(1)

                    confirm_btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Delete']")))
                    self.driver.execute_script("arguments[0].click();", confirm_btn)
                    time.sleep(2)
                    print("✅ Përdoruesi i thjeshtë u fshi me sukses.")
                    deleted = True
                    break
            except Exception as e:
                print(f"⚠️ Skipped row for deletion: {str(e)}")
                continue

        if not deleted:
            self.fail("❌ Nuk u gjet asnjë përdorues i thjeshtë për t'u fshirë.")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
