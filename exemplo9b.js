function Pessoa(nome, idade){
        this.nome = nome;
        this.idade = idade;
}

Pessoa.prototype.dizNome = function(argument){
	console.log(this.nome + " tem " + this.idade +  " anos.");
};


var p1 = new Pessoa("Carlos", 22);
console.log(p1);
p1.dizNome();


