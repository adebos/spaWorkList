var app = angular.module('workersApp', []);

app.directive('userList', ['$compile', function($compile) {
	return {
		restrict: 'E',
		controller: function($http, $scope, $filter){
			var flagEdit = false;
			var people = [];

			function show (list){
				$('#table').html('');
				for (var i = 0; i < list.length; i++) {
						people[i] = list[i];
					var index = i+1;
					var tab = angular.element('<tr>\
						<td>' + index + '</td>\
						<td>' + list[i].name + '</td>\
						<td>' + list[i].position + '</td>\
						<td>' + list[i].department + '</td>\
						<td>' + list[i].phoneNumber + '</td>\
						<td>' + list[i].email + '</td>\
						<td class="text-center"><button ng-click="listController.editItem(' + i + ')" class="btn btn-success">ред</button></td>\
						<td class="text-center"><button ng-click="listController.deleteItem(' + i + ')" class="btn btn-danger">удал</button></td>\
						</tr>');
					var linkFn = $compile(tab);
					var element = linkFn($scope);
					$('#table').append(element);
				};
			};
			//sort function
			var sortField = undefined;
			var reverse = false;

			$scope.sort = function (fieldName) {
				if(sortField === fieldName) {
					reverse = !reverse;
				} else {
					sortField = fieldName;
					reverse = false;
				}
				// console.log('field name: ',fieldName);
				// console.log('reverse: ', reverse);
				$http({
					method: 'POST',
					url: 'http://workers.chebatarou.com/update',
					data: $.param({json: JSON.stringify(people)}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function (result) {
					show($filter('orderBy')(JSON.parse(result),fieldName, reverse));
				})
				.error(function (result) {
					console.log('error', result);
				})
			};
			$scope.isSortUp = function(fieldName) {
				return sortField === fieldName && !reverse;
			};
			$scope.isSortDown = function(fieldName) {
				return sortField === fieldName && reverse;
			};

			function queryData() {
				$http({
					method: 'POST',
					url: 'http://workers.chebatarou.com/update',
					data: $.param({json: JSON.stringify(people)}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function (result) {


					show(JSON.parse(result));
				})
				.error(function (result) {
					console.log('error', result);
				})
			};


			this.add = function() {
				var currentWorker = {};
				for (var key in this.worker){
					currentWorker[key] = this.worker[key];
				}
				if (flagEdit) {
					people[this._item] = currentWorker;
					flagEdit = false;
					this._item = null;
				} else {
					people.push(currentWorker);
				}
				queryData();
				this.worker.name = ''; this.worker.position = ''; this.worker.department = '';  this.worker.phoneNumber = ''; this.worker.email = '';
			}

			this.deleteItem = function(item) {
				people.splice(item, 1);
				queryData();
			}

			this.editItem = function(item) {
				this._item = item;
				this.worker.name = people[item].name;
				this.worker.position = people[item].position;
				this.worker.department = people[item].department;
				this.worker.phoneNumber = people[item].phoneNumber;
				this.worker.email = people[item].email;
				flagEdit = true;
			}

			this.refresh = function(){
				$http.get('http://workers.chebatarou.com/list')
				.success(function (result) {
					console.log('result',result);
					console.log('JSON.parse(result)',JSON.parse(result));
					var rez = JSON.parse(result);
					show(rez);
				})
				.error(function (result) {
					console.log('error', result);
				})
			}

			this.refresh();
		},
		controllerAs: 'listController',
	}
}]);
