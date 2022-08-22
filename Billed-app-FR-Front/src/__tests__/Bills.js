/**
 * @jest-environment jsdom
 */
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES , ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";


jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      const highlightedIcon = windowIcon.getAttribute('class')
      //to-do write expect expression
      expect(highlightedIcon).toEqual('active-icon')

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('Given I am connected as Employee and I am on Bills page', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
   
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsDisplayed = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const eye = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn(() => {
        billsDisplayed.handleClickIconEye(eye)
      })

      eye.addEventListener('click', handleClickIconEye)
      fireEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
    
      const modale = document.getElementById('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})

describe('Given I am connected as Employee and I am on Bills page', () => {
  describe('When I click on newBill button', () => {
    test('Then should land on newBill page', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({ data: bills })
   
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsDisplayed = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const buttonNewBill = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(() => billsDisplayed.handleClickNewBill)
      buttonNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(buttonNewBill)
      const form = screen.getByTestId('form-new-bill')

      expect(handleClickNewBill).toHaveBeenCalled()
      expect(form).toBeTruthy()
    })
  })
})

// TEST D'INTEGRATION GET


describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      expect(screen.getByText("Mes notes de frais")).toBeTruthy()

      jest.spyOn(mockStore.bills(bills), 'list')
      const bill = await mockStore.bills(bills).list()
      //API methode get appelée 
     expect(jest.spyOn(mockStore.bills(bills), 'list')).toHaveBeenCalled()


    })

  describe("When an error occurs on API", () => {

    test("fetches bills from an API and fails with 404 message error", async () => {
    mockStore.bills(bills).list.mockImplementationOnce(() => {
      return Promise.reject(new Error("Erreur 404"))
    })

      
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
      //console.log(mockStore.bills(bills).list);
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills(bills).list.mockImplementationOnce(() => {
        return Promise.reject(new Error("Erreur 500"))
      })
  
        
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
        //console.log(mockStore.bills(bills).list);
  
    })
  })

  })
})