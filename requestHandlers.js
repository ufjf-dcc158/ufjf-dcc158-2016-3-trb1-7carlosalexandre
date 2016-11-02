var url = require("url");
var fs = require("fs");
var qs = require("querystring");
var himalaya = require('himalaya');

function index(req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write('<a href="http://localhost:8888/sobre.html">Sobre</a><br/><br/>');
	res.write('<a href="http://localhost:8888/aleatorios.html">Aleatorios</a><br/><br/>');
	res.write('<a href="http://localhost:8888/primos.html">Primos</a><br/><br/>');
	res.write('<a href="http://localhost:8888/equacao.html">Equacao</a><br/><br/>');
	res.write('<a href="http://localhost:8888/xadrez.html">Xadrez (HTML)</a><br/><br/>');
	res.write('<a href="http://localhost:8888/xadrez.json">Xadrez (JSON)</a><br/><br/>');
	res.end();
}

function sobre(req, res) {
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Nome: Carlos Alexandre de Almeida Pires\n");
	res.write("Matrícula: 201465502\n");
	res.write("E-mail: carlos.alexandre@engenharia.ufjf.br\n");
	res.write("Curso: Engenharia Computacional\n");
	res.end();
}

function aleatorios(req, res) {
	var pares = [];
	var impares = [];
	
	for(var i = 0; i < 100 ; i++) {
		var num = Math.floor(Math.random() * 100);
      		if(num%2==0){
         		pares.push(num);
      		}else {
         		impares.push(num);
      		}
   	}
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.write("Números pares: \n");
	res.write(pares.toString() + "\n");   	
	res.write("Números ímpares: \n");
	res.write(impares.toString() + "\n"); 
	res.end();
}

function primos(req, res) {
	var dados = url.parse(req.url, true).query;
	var num1 = Number(dados.n1);
	var num2 = Number(dados.n2);
	
	var primos = [];
	var div = 0; // verificacao de numero primo
	
	res.writeHead(200, {"Content-Type": "text/plain"});
	if(isNaN(num1) || isNaN(num2)){
		res.write("Dados invalidos. Tente novamente.\n");
	}else if(num2 < num1){
		res.write("Num1 e maior que num2. Tente novamente.\n");
	}else{
		for(var i=num1+1; i<num2; i++){
			for(var j=1; j<=i;j++){
				if(i%j == 0){div++;}
			}
			if(div == 2){primos.push(i);}
			div = 0; // recomecar contagem		
		}
		res.write("Números primos entre " + num1 + " e " + num2 + ": \n");
		res.write(primos.toString());
	}
	res.end();
}

function equacao(req, res) {
	if(req.method == "GET") {
		res.writeHead(200,{"Content-Type":"text/html"});
    		res.write('<h1>Equacao</h1>');
    		res.write('<form method="post">');
    		res.write('<label> Coeficiente a: <input type="number" name="a"/><br/><br/>');
		res.write('<label> Coeficiente b: <input type="number" name="b"/><br/><br/>');
		res.write('<label> Coeficiente c: <input type="number" name="c"/><br/><br/>');
    		res.write('<input type="submit">');
    		res.write('</form>');
    		res.end();
   
	}else if(req.method == "POST") {
		var body = '';
      
		req.on('data',function(data){
        		body += data;});

      		req.on('end',function(){
         		var coeficientes = qs.parse(body);
         		var a = Number(coeficientes.a);
			var b = Number(coeficientes.b);
			var c = Number(coeficientes.c);
			
			res.writeHead(200, {"Content-Type": "text/plain"});
			if(isNaN(a) || isNaN(b) || isNaN(c)){
				res.write("Algum dado é inválido. Tente novamente.\n");
			}else if(a == 0){
				res.write("Coeficiente a não pode ser zero. Tente novamente.\n");
			}else{
				var delta = (b*b)-(4*a*c);
				
				if(delta < 0){
					res.write("Valor de delta: " + delta + ".\n");
					res.write("Não possui raízes reais.");
				}else{
					var raiz1 = (-b - Math.sqrt(delta))/(2*a);
					var raiz2 = (-b + Math.sqrt(delta))/(2*a);
					
					if (delta == 0){
						res.write("Possui uma raíz real: " + raiz1 + ".\n");				
					}else{
						res.write("Possui duas raízes reais: " + raiz1  + " e " + raiz2 + ".\n");
					}
				}
			}
         		res.end();
      		});
	}
}

// Funcao para verificar posicoes validas de movimento da peca
function posicaoValida(linha, coluna, i, j){
	var posicoes = [[linha+2,coluna+1],[linha+2,coluna-1],[linha-2,coluna+1],[linha-2,coluna-1],[linha+1,coluna+2],[linha-1,coluna+2],[linha+1,coluna-2],[linha-1,coluna-2]];
	
	for(var k=0; k<posicoes.length; k++){
		if(i == posicoes[k][0] && j == posicoes[k][1]){
			return true;		
		}	
	}
	return false;
}

// Exercicio 9
function xadrez1(req, res) {
	var dados = url.parse(req.url, true).query
	var linha = parseInt(dados.linha);
	var coluna = parseInt(dados.coluna);

	if(isNaN(linha) || isNaN(coluna)){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Dados inválidos. Tente novamente.");
	}else if(linha <= 0 || linha > 8 || coluna <= 0 || coluna > 8){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Linha e/ou coluna abaixo de 1 ou acima de 8. Tente novamente.");
	}else{
		res.writeHead(200, {"Content-Type": "text/html"});
		var css = fs.readFileSync('xadrez.css', 'utf8');
   		res.write('<style>\n' + css + '\n</style>\n');
		res.write('<div id="containerFull">\n');
		res.write('<div id="container">\n');		

		for(j=0; j<8; j++){
			if(j%2 == 0){
				res.write('<div class="row line-1">\n');
			}else{
				res.write('<div class="row line-2">\n');			
			}
			for(i=0; i<8; i++){
				if(linha == i && coluna == j){
					res.write('\t<div id="' + ((8*j)+i) + '"> &#9816; </div>\n');
				}else if(posicaoValida(linha, coluna, i, j)){
					res.write('\t<div style="background-color:blue;" id="' + ((8*j)+i) + '"></div>\n');			
				}else{
					res.write('\t<div id="' + ((8*j)+i) + '"></div>\n');		
				}
			}
			res.write('</div>\n');	
		}
		res.write('</div>\n');
		res.write('</div>\n');
	}
	res.end();
}


function xadrez2(req, res) {
	var dados = url.parse(req.url, true).query	
	var linha = Number(dados.linha);
	var coluna = Number(dados.coluna);

	if(isNaN(linha) || isNaN(coluna)){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Dados inválidos. Tente novamente.");
	}else if(linha <= 0 || linha > 8 || coluna <= 0 || coluna > 8){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.write("Linha e/ou coluna abaixo de 1 ou acima de 8. Tente novamente.");
	}else{
		var html = '';
		res.writeHead(200, {"Content-Type": "application/json"});
		var css = fs.readFileSync('xadrez.css', 'utf8');
   		html += '<style>\n' + css + '\n</style>\n';
		html += '<div id="containerFull">\n';
		html += '<div id="container">\n';		

		for(j=0; j<8; j++){
			if(j%2 == 0){
				html += '<div class="row line-1">\n';
			}else{
				html += '<div class="row line-2">\n';			
			}
			for(i=0; i<8; i++){
				if(linha == i && coluna == j){
					html += '\t<div id="' + ((8*j)+i) + '"> &#9816; </div>\n';
				}else if(posicaoValida(linha, coluna, i, j)){
					html += '\t<div style="background-color:blue;" id="' + ((8*j)+i) + '"></div>\n';			
				}else{
					html += '\t<div id="' + ((8*j)+i) + '"></div>\n';		
				}
			}
			html += '</div>\n';	
		}
		html += '</div>\n';
		html += '</div>\n';
	}
	var json = himalaya.parse(html);
	console.dir(json, {colors: true, depth: null});
	res.end();
}

exports.index = index;
exports.sobre = sobre;
exports.aleatorios = aleatorios;
exports.primos = primos;
exports.equacao = equacao;
exports.xadrez1 = xadrez1;
exports.xadrez2 = xadrez2;