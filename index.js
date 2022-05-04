function sleep(ms) 
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  var canvasWidth = 484;
  var canvasHeight = 42;

  var p1 = document.querySelector('#p1');
  var ctx1 = p1.getContext('2d');
  ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx1.clearRect(0, 0, canvasWidth, canvasHeight);  

  var p2 = document.querySelector('#p2');
  var ctx2 = p2.getContext('2d');
  ctx2.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx2.clearRect(0, 0, canvasWidth, canvasHeight);  

  var p3 = document.querySelector('#p3');
  var ctx3 = p3.getContext('2d');
  ctx3.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx3.clearRect(0, 0, canvasWidth, canvasHeight);

  var p4 = document.querySelector('#p4');
  var ctx4 = p4.getContext('2d');
  ctx4.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx4.clearRect(0, 0, canvasWidth, canvasHeight);  

  var p5 = document.querySelector('#p5');
  var ctx5 = p5.getContext('2d');
  ctx5.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx5.clearRect(0, 0, canvasWidth, canvasHeight);

  function draw(Xposition, color, processNumber)
  {
    var width = 10;
    var height = 40;
    var Yposition = 1;

    switch(processNumber)
    {
      case 0: ctx1.fillStyle = color;
          ctx1.fillRect(Xposition, Yposition, width, height);
          break;

      case 1: ctx2.fillStyle = color;
          ctx2.fillRect(Xposition, Yposition, width, height);
          break;

      case 2: ctx3.fillStyle = color;
          ctx3.fillRect(Xposition, Yposition, width, height);
          break;

      case 3: ctx4.fillStyle = color;
          ctx4.fillRect(Xposition, Yposition, width, height);
          break;

      case 4: ctx5.fillStyle = color;
          ctx5.fillRect(Xposition, Yposition, width, height);
          break;

      default: console.log("error");
           break;

    }
  }

  async function fillBar(color, processNumber)
  {
    //console.log(lastXposition);
    var lastXposition = 1;
    for(var i = 0; i <= 41; i++)
    {
      draw(lastXposition, color, processNumber);
      await sleep(100);
      lastXposition += 12;      
    }
  }

  function handleSortingProcesses(processes, processesPriority)
  {
    var processesOrder = [];
    var list = [];

    for(var i = 0; i < processes.length; i++)
    {
      list.push({'processNumber': processes[i], 
                 'processPriority': processesPriority[i]});
    }

    list.sort((a, b) => {
      return ((a.processPriority > b.processPriority) ? - 1 : ((a.processPriority == b.processesPriority) ? 0 : 1));
    });

    //console.log(list[2].processNumber);
    
    for(var j = 0; j < processes.length; j++)
    {
      processesOrder.push(list[j].processNumber);
    }

    //console.log(processesOrder);
    return processesOrder;
  }

  function findWaitingTime(processes, waitingTime, burstTime, executionTime)
  {
    waitingTime[processes[0] - 1] = 0;

    for(var i = 1; i < burstTime.length; i++)
    {
      waitingTime[processes[i] - 1] = executionTime[processes[i - 1] - 1];
    }

    return waitingTime;
  }

  function findExecutionTime(processes, burstTime, waitingTime, executionTime)
  {
    executionTime[processes[0] - 1] = burstTime[processes[0] - 1];

    for(var i = 1; i < processes.length; i++)
    {
      executionTime[processes[i] - 1] = burstTime[processes[i] - 1] + executionTime[processes[i - 1] - 1];
    }

    return executionTime;
  }

  function sumArray(array)
  {
    var sum = 0;

    for(var i = 0; i < array.length; i++)
    {
      sum += array[i];
    }

    return sum;
  }

  function findAverageWaitingTime(processes, waitingTime)
  {
    var sum = sumArray(waitingTime);
    var average = sum / processes.length;
    console.log("averageWaitingTime = " + average);
  }

  function findAverageExecutionTime(processes, executionTime)
  {
    var sum = sumArray(executionTime);
    var average = sum / processes.length;
    console.log("averageExecutionTime = " + average);
  }

  async function cooperativePriority(processes, processesOrder, burstTime, waitingTime)
  {
    

    for(var i = 0; i < processes.length; i++)
    {
      await sleep(5000);
      fillBar('blue', (processesOrder[i] - 1));
    }

    var executionTime = [0, 0, 0, 0, 0];

    executionTime = findExecutionTime(processesOrder, burstTime, waitingTime, executionTime);
    //console.log('exec: ' + executionTime);

    waitingTime = findWaitingTime(processesOrder, waitingTime, burstTime, executionTime);
    //console.log('wait: ' + waitingTime);

    findAverageWaitingTime(processesOrder, waitingTime);

    findAverageExecutionTime(processesOrder, executionTime);
  }

  function handleRandomBurstTime(processes)
  {
    burstTime = [];

    for(var i = 0; i < processes.length; i++)
    {
      burstTime.push(parseInt(Math.random() * 10));
    }

    return burstTime;
  }

  function handleRandomPriority(processes)
  {
    priority = [];

    for(var i = 0; i < processes.length; i++)
    {
      priority.push(parseInt(Math.random() * 10));
    }

    return priority;
  }

  function handleInputBurstTime(processes)
  {
    var temp;
    var burstTime = [];

    for(var i = 1; i <= processes.length; i++)
    {
      temp = ("#btInputP" + i);
      burstTime.push(parseInt(document.querySelector(temp).value));
    }

    return burstTime;
  }

  function handleInputPriority(processes)
  {
    var temp;
    var priority = [];

    for(var i = 1; i <= processes.length; i++)
    {
      temp = ("#ptInputP" + i);
      priority.push(parseInt(document.querySelector(temp).value));
    }

    return priority;
  }

  function handleAppendOnHtml(elementId, item)
  {
    document.getElementById(elementId).append(item);
  }

  function coopPriority()
  {
    var processesOrder = handleSortingProcesses(processes, processesPriority);

    for(var i = 1; i <= processes.length; i++)
    {
      handleAppendOnHtml('p' + i + 'BurstTime', burstTime[i - 1]);
      handleAppendOnHtml('p' + i + 'Priority', processesPriority[i - 1]);
    }

    cooperativePriority(processes, processesOrder, burstTime, waitingTime);
  }

  function randomize()
  {
    isRandomized = true;
    burstTime = handleRandomBurstTime(processes);
    processesPriority = handleRandomPriority(processes);
  }

  function startInput()
  {
    burstTime = handleInputBurstTime(processes);
    processesPriority = handleInputPriority(processes);
    coopPriority();
  }

  function start()
  {
    if(isRandomized == false)
      startInput();
    else
      coopPriority();
  }

  var waitingTime = [0, 0, 0, 0, 0];    
  var processes = [1, 2, 3, 4, 5];
  var burstTime = [];
  var processesPriority = [];
  var isRandomized = false;
