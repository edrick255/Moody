// app.js

let data = [];
let chart;

function login(){
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;

  if(u && p){
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    initChart();
  } else {
    alert("Completa los campos");
  }
}

function logout(){
  location.reload();
}

function addFood(){
  const food = document.getElementById('food').value;
  const cal = +document.getElementById('calories').value;
  const pro = +document.getElementById('protein').value;
  const fat = +document.getElementById('fatInput').value;
  const carb = +document.getElementById('carbs').value;

  if(!food) return;

  const item = {food, cal, pro, fat, carb};
  data.push(item);

  updateTable();
  updateStats();
  updateChart();
}

function updateTable(){
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach(d=>{
    tbody.innerHTML += `
      <tr>
        <td>${d.food}</td>
        <td>${d.cal}</td>
        <td>${d.pro}</td>
        <td>${d.fat}</td>
        <td>${d.carb}</td>
      </tr>
    `;
  });
}

function updateStats(){
  let cal=0, pro=0, fat=0, carb=0;

  data.forEach(d=>{
    cal+=d.cal;
    pro+=d.pro;
    fat+=d.fat;
    carb+=d.carb;
  });

  document.getElementById('cal').innerText = cal;
  document.getElementById('pro').innerText = pro+"g";
  document.getElementById('fat').innerText = fat+"g";
  document.getElementById('carb').innerText = carb+"g";
}

function initChart(){
  const ctx = document.getElementById('chart');

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteína','Grasa','Carbs'],
      datasets: [{
        data: [0,0,0]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      }
    }
  });
}

function updateChart(){
  let pro=0, fat=0, carb=0;

  data.forEach(d=>{
    pro+=d.pro;
    fat+=d.fat;
    carb+=d.carb;
  });

  chart.data.datasets[0].data = [pro,fat,carb];
  chart.update();
}
