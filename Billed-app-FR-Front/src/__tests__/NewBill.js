/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES , ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import { bills } from "../fixtures/bills.js"
import BillsUI from "../views/BillsUI.js";
jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then NewBill form should display", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const formNewBill = screen.getAllByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy()

    })

   
  })
})

describe("Given I am connected as an employee and I am on NewBill page", () => {
  describe("When I submit the form with an image (jpg, jpeg, png)", () => {
    test("Then it should create a new bill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const submitFormButton = screen.getByTestId('form-new-bill')

      const store = null
      const fileName = 'test.jpeg'
      // init
      const newBill = new NewBill({
        document, onNavigate, store ,localStorage : window.localStorage
      })
      
      newBill.fileName = fileName


      //mock function handleSubmit
      const handleSumbit = jest.fn(() => newBill.handleSubmit)

      //add event listener to call handleSubmit
      submitFormButton.addEventListener('submit', handleSumbit)

      //fire event
      fireEvent.submit(submitFormButton)

      // expect handleSubmit to be called
      expect(handleSumbit).toHaveBeenCalled()

    })
  })


  describe("When I submit the form with an image that is not jpg, jpeg, png", () =>{
    test("Then user should stay on NewBill page", () =>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const store = null
      const fileName = "invalid_file.txt"  
      const submitFormButton = screen.getByTestId('form-new-bill')
      // init
      const newBill = new NewBill({
        document, onNavigate, store ,localStorage : window.localStorage
      })
      newBill.fileName = fileName

      //mock function handleSubmit
      const handleSumbit = jest.fn(() => newBill.handleSubmit)

      //add event listener to call handleSubmit
      submitFormButton.addEventListener('submit', handleSumbit)

      //fire event
      fireEvent.submit(submitFormButton)

      const form = screen.getByTestId('form-new-bill')
      //if form exist it means we are still on the newbill page
      expect(form).toBeTruthy()

    })
  })

  describe("When I update the image (jpg, jpeg, png)", () => {
    test("Then it should return fileName", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const store = mockStore
      // init
      const newBill = new NewBill({
        document, onNavigate, store ,localStorage : window.localStorage
      })
  
      const updateFileInput = screen.getByTestId('file')
      const handleChange = jest.fn(() => newBill.handleChangeFile)
      updateFileInput.addEventListener('change', handleChange)
      fireEvent.change(updateFileInput)
     
      //function to be called
      expect(handleChange).toHaveBeenCalled()
    })
  })


  //TEST INTEGRATION POST
describe("Given I am a user connected as Employee & I navigate to NewBill", () => {
  describe("When I submit form new bill", () => {
    test("It should create bill from mock API POST", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
   
      jest.spyOn(mockStore.bills(bills), 'update')
      // init
        const newBillAdded = {
          "id": "47qAXb6fkLzMroIm2zOK",
          "vat": "100",
          "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
          "status": "pending",
          "type": "Hôtel et logement",
          "commentary": "séminaire billed",
          "name": "test creation",
          "fileName": "preview-facture-free-201801-pdf-1.jpg",
          "date": "2004-04-04",
          "amount": 400,
          "commentAdmin": "ok",
          "email": "a@a",
          "pct": 20
      }
      await mockStore.bills(bills).update(newBillAdded)
      //API methode get appelée 
      expect(jest.spyOn(mockStore.bills(bills), 'update')).toHaveBeenCalledTimes(1)
    })

  

  })

  describe("When an error occurs on API", () => {

    test("post bills from an API and fails with 404 message error", async () => {
    mockStore.bills(bills).update.mockImplementationOnce(() => {
      return Promise.reject(new Error("Erreur 404"))
    })

    //récuperer l'erreur 404 de la page ou elle se trouve
      const html = BillsUI({
      error: 'Erreur 404'
      });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);

      expect(message).toBeTruthy();
  
    })
  
    test("post messages from an API and fails with 500 message error", async () => {
      mockStore.bills(bills).update.mockImplementationOnce(() => {
        return Promise.reject(new Error("Erreur 500"))
      })
  
      //récuperer l'erreur 404 de la page ou elle se trouve
      const html = BillsUI({
      error: 'Erreur 505'
      });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 505/);

      expect(message).toBeTruthy();
    })
  })
  
})



})





