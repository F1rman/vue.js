var storage = window.localStorage;
// storage.removeItem() // Pass a key name to remove that key from storage.
// storage.setItem('key',val );
// storage.setItem('passlvl',16);
console.log(storage);
var d = new Date();
// ANGULAR
var app = angular.module("Routing", ["ngRoute", 'ngAnimate']);
app.run(($rootScope, $interval) => {
  $rootScope.APPNAME = 'Planner';
  $rootScope.v = '0.2'
  $rootScope.d = d;
  $interval(function() {
    $rootScope.time = new Date()
  }, 17); // every 17 milliseconds just to spiced it up a bit.

  console.log($rootScope.v);
})

app.controller('Main', function($scope) {
  var task_progress = 25;
  var del_task_timer;
  var task_color = 'red lighten-3';


  $scope.menu = [{
      'modal': 'Info',
      'ico': 'info'
    },
    {
      'modal': 'About us',
        'ico': 'account_circle'
    },
    {
      'modal':'Privacy Policy',
        'ico': 'verified_user'
      }
  ]
  $scope.soc = [{
      'name': 'Instafly',
      'ico': 'instafly.png',
      'href': 'https://play.google.com/store/apps/details?id=com.verblike.promofly&hl=en_US'
    },
    {
      'name': 'Verblike',
        'ico': 'v.svg',
        'href': 'https://verblike.com/'
    },
    {
      'name':'Telegram',
        'ico': 't.jpg',
        'href': 'https://web.telegram.org/#/im?p=@verbalike'
      }
  ]
  $scope.storage = storage;
  $scope.important = [{
      'im': 'Important',
      'cl': '0',
      'sm': '!!!'
    },
    {
      'im': 'Medium',
      'cl': '1',
      'sm': '!!'
    },
    {
      'im': 'Low',
      'cl': '2',
      'sm': '!'
    },
  ]
  $scope.chosed_im = 0;
  $scope.open = (a) => {
    $scope.datail_task = a;
  }
  $scope.soc_select = (a) => {
    $scope.soc_num = a;
  }
  $scope.show_no_tasks=[]
  $scope.show_no_tasks[1]= false;
  $scope.show_no_tasks[2]= false;
  $scope.show_no_tasks[0]= false;
  $scope.select = (a) => {
    $scope.num_task = a;
    $scope.priority = a;
    $scope.chosed_im = a;

    // $scope.editToDoTitle = $scope.toDos[a].title;
    // $scope.editToDoDescription = $scope.toDos[a].description;
    // $scope.editattedDate = $scope.toDos[a].dueByDate;
    // $scope.editformDueTime = $scope.toDos[a].dueByTime;
    // $('#important_edit').value = $scope.toDos[a].important;
  }
  $scope.clearInput = (a, b, c, d, e) => {
    a = '', b = '', c = '', d = '', e = '';
  }
  var titleToDo = '';
  var titleToDo_arr = [];
  $scope.sort_by_title = () => {
    $scope.toDos.sort(function(a, b) {
      var nameA = a.title.toUpperCase(); // ignore upper and lowercase
      var nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  }


  $scope.sort_by_important = () => {
    $scope.toDos.sort(function(a, b) {
      return a.important - b.important
    })
  }


  function check_if_have_tasks_storage() {
    $scope.toDos = JSON.parse(storage.getItem('tasks'));
    if ($scope.toDos == null) {
      $scope.toDos = []
    }
    if (storage.getItem('tasks') == undefined || storage.getItem('tasks') == null || storage.getItem('tasks') == '[]' || $scope.toDos.length == 0) {
      $scope.toDos = [];
      $scope.no_tasks = true;
    } else {
      $scope.no_tasks = false;
      $scope.toDos = JSON.parse(storage.getItem('tasks'));
    }

  }
  check_if_have_tasks_storage()

  $scope.sort_by_date = ()=>{
      $scope.toDos.sort(function(a, b) {
      var dateA = new Date(a.dueByDate), dateB = new Date(b.dueByDate);
      return dateA - dateB;
  })
}
  $scope.sort_by_date()
  $scope.changeTodo = (a) => {
    $scope.toDos[a].title = $scope.editToDoTitle;
    $scope.toDos[a].description = $scope.editToDoDescription;
    $scope.toDos[a].dueByDate = $scope.editattedDate;
    $scope.toDos[a].dueByTime = $scope.editformDueTime;
    $scope.toDos[a].important = $('#important_edit').val();
    refresh_stor($scope.toDos)
    check_if_have_tasks_storage()
    M.toast({
      html: 'Task successfuly changed'
    })
  }

  $scope.addToDo = function() {
    if ($scope.formToDoTitle == undefined || $scope.formToDoTitle == null || $scope.formToDoTitle == '') {
      $scope.formToDoTitle = "Default title"
    }
    if ($scope.formDueDate==undefined) {
        $scope.formDueDate =  d.getFullYear()+10+'-07-23T21:00:00.000Z';
    }

    $scope.toDos.push({
      title: $scope.formToDoTitle,
      description: $scope.formToDoDescription,
      dueByDate: $scope.formDueDate,
      dueByTime: $scope.formDueTime,
      progress: 25,
      important: $('#important').val()
    });

    refresh_stor($scope.toDos)
    check_if_have_tasks_storage()
    $scope.formToDoTitle = '';
    $scope.formToDoDescription = '';
    $scope.formDueDate = '';
    $scope.formDueTime = '';
    M.toast({
      html: 'Task successfuly created'
    })

  };

  function check_smaller_task() {
    var sm_tasks = $scope.toDos[$scope.datail_task].smaller_tasks
    if (sm_tasks == undefined || sm_tasks == null || sm_tasks == '[]') {
      $scope.toDos[$scope.datail_task].smaller_tasks = []
      $scope.no_smaller_tasks = true;
      console.log(sm_tasks == undefined || sm_tasks == null || sm_tasks == '[]');
    } else {
      sm_tasks = JSON.parse(storage.getItem('tasks'))[$scope.datail_task].smaller_tasks
    }
  }

  // console.log(sm_tasks);
  $scope.addSmallTasks = function() {
    check_smaller_task()
    console.log($scope.toDos[$scope.datail_task].smaller_tasks);
    $scope.toDos[$scope.datail_task].smaller_tasks.push({
      title_small: $scope.formToDoTitle_small,
      description_small: $scope.formToDoDescription_small,
      dueByDate_small: $scope.formDueDate_small,
      dueByTime_small: $scope.formDueTime_small,
    });

    refresh_stor($scope.toDos);
    $scope.clearInput($scope.title_small, $scope.description_small, $scope.dueByDate_small, $scope.dueByTime_small)

  };

  // Видалення таска
  $scope.removeToDo = function(toDo) {
    $('.li' + $scope.toDos.indexOf(toDo)).slideUp();
    del_task_timer = setTimeout(() => {
      var index = $scope.toDos.indexOf(toDo);
      $scope.toDos.splice(index, 1);
      refresh_stor($scope.toDos)
      check_if_have_tasks_storage()
    }, 3000)
    console.log($scope.toDos.indexOf(toDo));
    var toastHTML = '<span>Task successfuly deleted</span><button id="undo" class="btn-flat toast-action">Undo</button>';
    M.toast({
      html: toastHTML,
      displayLength: 3000
    });
    $("body").on('click', '#undo', function() {
      $(this).addClass("undo");
      var toastElement = document.querySelector('.toast');
      var toastInstance = M.Toast.getInstance(toastElement);
      clearTimeout(del_task_timer);
      $('.li' + $scope.toDos.indexOf(toDo)).slideDown();
      console.log(del_task_timer);
      //undofunction();

    });
  };

  // для збереженняя в localStorage
  function refresh_stor(a) {
    storage.setItem('tasks', JSON.stringify(a));
  }

  $(document).ready(function() {


    var r = 0;
    $('.link').click(function(e) {
      $('body').css("background", $(this).css("background"));
    });

    $('.pick').click(function(e) {
      var j = 1;
      $('.fab').css("background", color[r][0]);
      $('.link').each(function(f) {
        $(this).css("background", color[r][j]);
        j++;
      });
      if (r < color.length - 1)
        r++;
      else
        r = 0;
    });

    var color = [
      [
        "#b71c1c",
        "#ffcdd2",
        "#ef9a9a",
        "#ef5350",
        "#e53935",
        "#c62828"
      ],
      [
        "#0d47a1",
        "#bbdefb",
        "#64b5f6",
        "#2196f3",
        "#1976d2",
        "#1565c0"
      ],
      [
        "#1b5e20",
        "#c8e6c9",
        "#81c784",
        "#4caf50",
        "#388e3c",
        "#2e7d32"
      ],
      [
        "#ff6f00",
        "#ffecb3",
        "#ffd54f",
        "#ffc107",
        "#ffa000",
        "#ff8f00"
      ],
    ];

    M.AutoInit();
    // $('#modal_create_small_tasks .datepicker').datepicker({
    //   'container': $('#modal_create_small_tasks .data'),
    //   'minDate': d,
    //   'showDaysInNextAndPreviousMonths': true,
    //   'onSelect': (a) => {
    //     $scope.formDueDate = a;
    //   }
    // })
    // $('#modal_create_small_tasks .timepicker').timepicker({
    //   'twelveHour': false,
    //   'onSelect': (b, c) => {
    //     $scope.formDueTime = b + ':' + c;
    //   }
    // });
    $('#modal_create .datepicker').datepicker({
      'container': $('#modal_create .data'),
      'minDate': d,
      'showDaysInNextAndPreviousMonths': true,
      'onSelect': (a) => {
        $scope.formDueDate = a;
      }
    })
    $('#modal_create .timepicker').timepicker({
      'twelveHour': false,
      'onSelect': (b, c) => {
        $scope.formDueTime = b + ':' + c;
      }
    });
    $scope.opentime = (ifsmall) => {
      console.log(ifsmall== 'big');
      $scope.change_ico = true;
      if (ifsmall='small') {
        $('#modal_create_small_tasks .datepicker-modal').hide()
        $('#modal_create_small_tasks .timepicker-modal').show()
      }
        $('#modal_create .datepicker-modal').hide()
        $('#modal_create .timepicker-modal').show()

      }



    $scope.opendata = (ifsmall) => {
      $scope.change_ico = false;
      console.log(ifsmall);
      if (ifsmall='small') {
        $('#modal_create_small_tasks .datepicker-modal').hide()
        $('#modal_create_small_tasks .timepicker-modal').show()
      }
        $('#modal_create .timepicker').timepicker('open');
        $('#modal_create .datepicker').datepicker('open');
        $('#modal_create .timepicker-modal').hide()
        $('#modal_create .datepicker-modal').show()


}


  });



});
