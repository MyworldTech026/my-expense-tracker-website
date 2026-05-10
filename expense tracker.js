const desc = document.querySelector('.js-description')
const amount = document.querySelector('.js-amount')
const category = document.querySelector('.js-category')
const expenseContainer = document.querySelector('.js-expenses-list')
const totalExpense = document.querySelector('.js-total')
const filter = document.querySelector('.js-filter')
const empty = document.querySelector('.js-empty')
const error = document.querySelector('.js-form-error')
const canvas = document.querySelector('.js-chart')
const noChart = document.querySelector('.js-no-chart')
const legendChart = document.querySelector('.js-legend')




//Read Data From localStorage
let expenseTracker = JSON.parse(localStorage.getItem('expenses')) || []

let myChart=null

function renderChart(expenseTracker){
const categories={}

if(expenseTracker.length===0){
   noChart.textContent=`No data yet`
}
else{
noChart.textContent=''
}
expenseTracker.forEach((expense)=>{
  if(categories[expense.categoryInput]){
    categories[expense.categoryInput] +=Number(expense.amountInput)
  }else{
    categories[expense.categoryInput]=Number(expense.amountInput)
  }
})

const labels=Object.keys(categories)
const values=Object.values(categories)

let colors=['#e85030','#30a8e8','#a030e8','#e8a030','#30e880','#e83080','#8888a8']

if(myChart){
  myChart.destroy()
}

myChart=new Chart(canvas,{
  type:'pie',
  data:{
    labels,
    datasets:[{
      data:values,
      backgroundColor:colors
    }]
  },
options:{
  responsive:true,
  maintainAspectRatio:true
}
})


let labeldiv=''
 labels.forEach((label,index)=>{
labeldiv+=
   `
    <div class="legend-item">
        <div class="legend-dot" style=background:${colors[index]}></div>
        <span class="legend-label">${label}</span>
        <span class="legend-amount" style=color:${colors[index]}>${values[index]}</span>
      </div>
   `
  })

   legendChart.innerHTML=labeldiv
  
  
}




// Display function
function display(expenses) {
  let container = ''
  let total = 0
  expenses.forEach((tracker, index) => {
    total += tracker.amountInput
    container +=
      `
    <div class="expense-item js-expense-item">
    <span class="title">expense card</span>
    <div class="expense-cat-dot"></div>
    <div class="expense-info">
      <div class="expense-description">${tracker.descInput}</div>
      <div class="expense-category">${tracker.categoryInput}</div>
    </div>
    <div class="expense-amount">$${tracker.amountInput}</div>
    <button class="expense-delete js-delete" data-id='${tracker.id}' data-index='${index}'>X</button>
  </div>
      `
  })
  if (expenseTracker.length === 0) {
    empty.classList.remove('hidden')
  } else {
    empty.classList.add('hidden')
  }
  expenseContainer.innerHTML = container
  totalExpense.innerHTML = total === 0 ? '$0.00' : `$${total}`

  renderChart(expenseTracker)
}


const form = document.querySelector('#expense-form')

//Handle Form Submission
form.addEventListener('submit', (e) => {
  e.preventDefault()
  let descInput = desc.value.trim()
  let amountInput = Number(amount.value)
  let categoryInput = category.value.trim()

  if (!descInput || !amountInput || !categoryInput) {
    error.classList.remove('hidden')
    error.textContent = `Fill in all field`
    return
  }
  error.classList.add('hidden')
  expenseTracker.push({ id: Date.now(), descInput, amountInput, categoryInput })
  saveToStorage(expenseTracker)
  filter.value = 'All'
  display(expenseTracker)
  form.reset()
})

// Handle filtering Of Expenses By Category
filter.addEventListener('change', (e) => {
  let value = e.target.value
  let ret = expenseTracker.filter((search) => {
    if (value === 'All') return true
    return search.categoryInput === value
  })
  display(ret)

})

//Handle Deleting of expense
expenseContainer.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.js-delete')
  if (!deleteBtn) return

  const id = Number(deleteBtn.dataset.id)

  expenseTracker = expenseTracker.filter((expense) => {
    return expense.id !== id
  })

  const currentFilter = filter.value
  const filterd = expenseTracker.filter((expense) => {
    if (currentFilter === 'All') return true
    return expense.categoryInput === currentFilter
  })
  saveToStorage(expenseTracker)
  display(filterd)
})

// Handle Saving/Writing  To localStorage
function saveToStorage(expenseTracker) {
  localStorage.setItem('expenses', JSON.stringify(expenseTracker))
}


// Render The UI
display(expenseTracker)
