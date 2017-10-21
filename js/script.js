var main_table; //главная переменная в которой будет храниться наш объект класса таблица
// Вообще если делать много таблиц , т.е. много объектов, нужно делать и 
// вкладку переключения и какой то список их, пока решил этим перенебречь

var add_table = document.getElementById('add_table'); // кнопка создать таблицу
var insert_row = document.getElementById('insert_row'); // вставить строку
var add_row = document.getElementById('add_row'); // добавить в конец
var get_data = document.getElementById('get_data'); // получить json
var clean_table = document.getElementById('clean_table'); // очистить таблицу от данных
var delete_table = document.getElementById('delete_table'); // удалить таблицу

var modal = document.getElementById('modal'); // Окно созданя таблицы
var modal1 = document.getElementById('modal1'); // Поле ввода количества строк
var modal2 = document.getElementById('modal2'); // Поле ввода имени столбца
var modal3 = document.getElementById('modal3'); // Кнопка Добавить
var modal4 = document.getElementById('modal4'); // Кнопка Удалить
var modal5 = document.getElementById('modal5'); // Список столбцов
var modal6 = document.getElementById('modal6'); // Чек 1
var modal7 = document.getElementById('modal7'); // Чек 2
var modal8 = document.getElementById('modal8'); // Чек 3
var modal9 = document.getElementById('modal9'); // Кнопка Ок
var modal10 = document.getElementById('modal10'); // Кнопка Очистить

var columns = []; // в js вроде как нельзя создавть свойство-значение, 
//сделал пока так, можно конечно просписать в прототип, если говорим о модульности

// - fields -массив названий столбцов таблицы
// - rows - количество строк в таблице
// - meta - опциональный параметр, в который можно передать 
class Table {

	constructor(fields, rows, css) {
		this.css = css || false;
		this.fields = fields;
		this.rows = rows;
	}

	static create_row(t, col, pointer_row) { // статик метод создания строки создал, ибо он часто повторялсяЫ

		var point = pointer_row || false; //указатель на строку после которой мы хотим вставить строку  (опционально)
		var table_layout = t; // Указатель на таблицу
		var col_lenght = col;  //указатель на количество столбцов
		var row; 
		var cell; 

		// console.log('Функция creatr row и строка после которой = '+ point);
		if (point == false){
			row = table_layout.insertRow();
		}
		else {
			var a = parseInt(point)+1;
			//alert('Индекс после суммы ' + a);
			row = table_layout.insertRow(parseInt(point)+1);
			
		}

		row.addEventListener('click', function() { // событие для определения индекса строки
    			var info_row = document.getElementById('info_row');// так делать не особ хорошо если мы говорим о модульности
    			info_row.getElementsByTagName('span')[0].innerHTML = this.rowIndex; // но оставил пока так
    		}) 
		
        row.className = 'row_table';

	 	for (var n = 0; n < col_lenght; n++) { 
	 		cell = row.insertCell(n);
    		cell.className = 'table_cell';
    		//так и не смог сделать пустую ячеку что бы она не схлопывалась
    		//решил добавить это
    		cell.innerHTML = '&nbsp';
    		cell.setAttribute('contenteditable','false'); // ввод

    		cell.addEventListener('dblclick', function() {
    			if(this.getAttribute('contenteditable') == true)
    			{
    				this.setAttribute('contenteditable','false');
    				this.blur();
    			}
    			else {
    				this.setAttribute('contenteditable','true');
    				this.focus();
    			}
    		});

    		cell.addEventListener('blur', function() { // событие отслеживания потерия фокуса с ячейки
    			this.setAttribute('contenteditable','false');
    		});	
    	}
	}

	//создание макета таблицы в виде элемента
	create_table(ch1,ch2,ch3) {
		var table_layout = document.createElement('table');
		table_layout.setAttribute('id', 'main_table');
		table_layout.setAttribute('border', '1');
		var chek1 = ch1, chek2 = ch2, chek3 = ch3;
		var row = table_layout.insertRow(0);
        var cell;

        var style = document.getElementsByClassName('table_style_special'); // проеверяем наличие нашего спец стайла для таблицы и удаляем его если он есть
        if(style != null)
        {
        	for(var i=0; i< style.length; i++)
        	{
        		style[i].remove();
        	}
        }

        style = document.createElement('style'); 
        style.type = 'text/css';
        style.className = 'table_style_special'; // создаем свой стайл с классом что б было легче потом удалить
        
        if(chek1 == true) // если был нажат чек, то мы стилизуем название столбцов (добавляем в head)
        {
			style.innerHTML += '.cell_name { padding: 0px 5px; border: 2px solid #636363; }';
        }

        if(chek2 == true) // стилизуем четные строки
        {
			style.innerHTML += '.row_table:nth-child(even) { background: #FFEEBA; border: 2px solid #DBC88F; empty-cells: show; padding: 0px 5px; }';	
        }

        if(chek3 == true) // стилизуем не четные строки
        {
			style.innerHTML += '.row_table:nth-child(odd) { background: #FFFDE1; border: 2px solid #DBC88F; /* Граница вокруг ячеек */ empty-cells: show; padding: 0px 5px; }';
        }

        if(style.innerHTML!='') { // если пустой то не создает
        	document.getElementsByTagName('head')[0].appendChild(style);
        }
         

        for (var j = 0; j < this.fields.length; j++) { 
		 	cell = row.insertCell(j);
		 	cell.outerHTML = "<th class='cell_name'>" + this.fields[j] + '</th>';
        	
		}

		for (var i = 0; i < this.rows; i++) { 
   			Table.create_row(table_layout, this.fields.length ); //вызываем сатик метод создания строки
		}
		return table_layout;
	}

	//добавляет строку после указанной в параметре строки
	insert_row(row_after_index) {
		// console.log('Пришли в метод класса ' );
		var elem = document.getElementById('main_table');
		Table.create_row(elem, this.fields.length, row_after_index );
		this.rows +=1; // вообще тут наверно лучше через сетер
	}

	//добавляет строку в конец таблицы
	add_row() {
			var elem = document.getElementById('main_table');
			Table.create_row(elem, this.fields.length );
			this.rows +=1; // вообще тут наверно лучше через сетер
	}

	//получает JSON объект данных из таблицы
	get_data() {
		var table = document.getElementById('main_table');
		var trs = table.rows,
        trl = trs.length,
        i = 0,
        j = 0,
        keys = [],
        obj, ret = [];

	    for (; i < trl; i++) {
	        if (i == 0) {
	            for (; j < trs[i].children.length; j++) {
	                keys.push(trs[i].children[j].innerHTML);
	            }
	        } else {
	            obj = {};
	            for (j = 0; j < trs[i].children.length; j++) {
	                obj[keys[j]] = trs[i].children[j].innerHTML;
	            }
	            ret.push(obj);
	        }
	    }

    	return ret;
		}

	//очищает таблицу от данных
	clean_table() {
		if(confirm('Вы точно хотите очистить таблицу от данных?')==true)
		{
			var elem = document.getElementsByClassName('table_cell');
  			for (var i = 0; i < elem.length; i++) {
  				elem[i].innerHTML = '&nbsp';
  			}
		}
	}

	//удаление таблицы
	delete_table() {
		if( confirm('Вы точно хотите УДАЛИТЬ таблицу?')==true )
		{
			var elem = document.getElementById('main_table');
	  		elem.remove();
	  		return true;
  		}
	}
}; // конец класса



add_table.addEventListener('click', function () { //кнопка Добавить таблицу
	modal.classList.toggle('hide');
})

insert_row.addEventListener('click', function () { //кнопка вставить строку
	if(main_table != undefined) {

		var index = document.getElementById('info_row').getElementsByTagName('span')[0].innerHTML;
		
		if(index != undefined) {
			//alert('Индекс передаваемыей в insert_row ' + index);
			// console.log('Пришли в метод кнопки. Строка после которой втсавляем = ' + index );
			main_table.insert_row(index);
		}
	}
})

add_row.addEventListener('click', function () { //кнопка добавить строку в конец
	if(main_table != undefined) {
			main_table.add_row();
	}
})

get_data.addEventListener('click', function () { //кнопка json
	if(main_table != undefined) {
		alert(JSON.stringify(main_table.get_data()));
		
	}
})

clean_table.addEventListener('click', function () { //кнопка очистить от данных
	if(main_table != undefined) {
		main_table.clean_table();
	}
})

delete_table.addEventListener('click', function () { //кнопка Удалить таблицу
	if(main_table != undefined) {
		if(main_table.delete_table() == true)
		{
			main_table = undefined; // очищаем главную пременную
		}
	}
})

function AddColumnsName() { // функция добавления имени столбца в список
	if(modal2.value != '') {
	var new_op = document.createElement('option'); 
	new_op.innerHTML = modal2.value;

	if(modal5.length == 0) { // ввод первого элемента
		modal5.appendChild(new_op);
		columns.push(modal2.value);
		modal2.value = '';
		// console.log('1');
	}
	else {
			var add = 1;
			var a = 0;
			while(a < modal5.length) // проверяем есть ли сходства
			{
				if(modal5.children[a].value == new_op.value )
				{
					a = modal5.length+1; // если есть то сразу вываливаемся, что бы не делать лишние иттерации
					add =0;
				}
				a++;
			}

				if(add == 1) // добавляем
				{ 
					// console.log('Не');
					modal5.appendChild(new_op);
					columns.push(modal2.value);
					modal2.value = '';
				}	
		}
	}
	modal2.focus();
}

modal3.addEventListener('click', function () { //добавить столбец
	AddColumnsName();
	modal2.focus();
})

modal2.addEventListener('keypress', function (e) { //добавить столбец по нажатию ентер
	if (e.which == 13 || e.keyCode == 13) {
		AddColumnsName();
    }
})

modal4.addEventListener('click', function () { //удаление имени столбца
	var select = modal5.options[modal5.selectedIndex]; 
	columns.splice(modal5.selectedIndex,1);
	modal5.removeChild(select);
})


modal1.onkeypress = function(e) { //Обработчик ввода, для ввода только цифр
	e = e || event;

	if (e.ctrlKey || e.altKey || e.metaKey) { return };

	var chr = getChar(e);
	if (chr == null) return;
	if (chr < '0' || chr > '9') 
	{
	return false;
	}
}

function getChar(event) {
      if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode) // IE
      }

      if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) // остальные
      }

      return null; // специальная клавиша
}

modal9.addEventListener('click', function () { //кнопка ОК (создание таблицы)
	if( (modal1.value !='') && (columns.length != 0) )
	{
		var box_table = document.getElementById('box_table');
		box_table.innerHTML='';
		main_table = new Table( columns, modal1.value );

		var table = main_table.create_table( modal6.checked, modal7.checked, modal8.checked);// добавляем макет в отдельную переменную что бы добавить событие

		box_table.appendChild(table); //добавляем наш макет таблицы на страницу
	}
	//
})

modal10.addEventListener('click', function () { //очистить
	modal1.value='';
	modal2.value='';
	modal5.innerHTML='';
	modal6.checked = '';
	modal7.checked = '';
	modal8.checked = '';
	columns = [];
})


