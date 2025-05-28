import unittest
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


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


class TestContactSubmission(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(options=setup_chrome_options())
        self.wait = WebDriverWait(self.driver, 20)
        self.driver.maximize_window()

    def login(self, email, password):
        self.driver.get("https://localhost:5173/login")
        self.wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(email)
        self.driver.find_element(By.NAME, "password").send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        self.wait.until(lambda d: "login" not in d.current_url.lower())
        time.sleep(2)

    def logout(self):
        try:
            logout_button = self.wait.until(EC.element_to_be_clickable((
                By.XPATH, "//button[contains(text(), 'Logout') and contains(@class, 'MuiButton-outlined')]"
            )))
            self.driver.execute_script("arguments[0].scrollIntoView(true);", logout_button)
            self.driver.execute_script("arguments[0].click();", logout_button)
            self.wait.until(lambda d: "login" in d.current_url.lower())
            time.sleep(2)
        except Exception as e:
            self.fail(f"❌ Logout nuk funksionoi: {str(e)}")

    def submit_contact_form(self):
        self.driver.get("https://localhost:5173/contact")
        rand = random.randint(1000, 9999)
        self.rand = rand
        self.email = f"random{rand}@mail.com"
        self.wait.until(EC.presence_of_element_located((By.NAME, "name"))).send_keys(f"Random User {rand}")
        self.driver.find_element(By.NAME, "email").send_keys(self.email)
        self.driver.find_element(By.NAME, "subject").send_keys(f"Subject {rand}")
        self.driver.find_element(By.NAME, "message").send_keys(f"Test message number {rand}")
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Send Message')]").click()
        time.sleep(3)

    def delete_contact_as_admin(self):
        self.driver.get("https://localhost:5173/dashboard")
        self.wait.until(EC.presence_of_element_located((
            By.XPATH, "//h5[contains(text(), 'Contact Submissions')]"
        )))
        time.sleep(2)

        rows = self.driver.find_elements(By.XPATH, "//h5[contains(text(), 'Contact Submissions')]/../../..//table//tbody/tr")
        self.assertTrue(rows, "❌ Asnjë kontakt nuk u gjet në Dashboard.")

        try:
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) < 6:
                    continue
                email_cell = cells[1]
                if email_cell.text.strip() == self.email:
                    delete_btn = row.find_element(By.XPATH, ".//button[contains(@class, 'MuiIconButton-root')]")
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", delete_btn)
                    self.driver.execute_script("arguments[0].click();", delete_btn)
                    time.sleep(1)
                    confirm_button = self.wait.until(EC.element_to_be_clickable(
                        (By.XPATH, "//button[contains(text(), 'Delete')]")
                    ))
                    self.driver.execute_script("arguments[0].click();", confirm_button)
                    time.sleep(2)
                    return
            self.fail("❌ Kontakt me email-in e dërguar nuk u gjet për fshirje.")
        except Exception as e:
            self.fail(f"❌ Nuk u arrit çfshirja e kontaktit: {str(e)}")

    def test_submit_and_delete_contact(self):
        print("➡️  Po kyçemi si user për të dërguar kontakt...")
        self.login("ubejdaliu@gmail.com", "Omeraliu12.")
        self.submit_contact_form()
        self.logout()

        print("➡️  Po kyçemi si admin për të fshirë kontaktin...")
        self.login("ubejdaliu521@gmail.com", "Omeraliu12.")
        self.delete_contact_as_admin()

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
