class SalaryTooLowError(Exception):
    pass

def check_salary(salary):
    if salary < 10000:
        raise SalaryTooLowError("SalaryTooLowError")
    else:
        print("Valid Salary")

salary = 8000

try:
    check_salary(salary)
except SalaryTooLowError as e:
    print(e)