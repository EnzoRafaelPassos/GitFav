import { GitHubUsers } from "./GithubUsers.js";


export class Favorite {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {

        this.entries = JSON.parse(localStorage.getItem('@github-fav:')) || [];
    }

    async add(username) {

        try {
            const userExists = this.entries.find(entry => entry.login === username);

            if (userExists) {
                throw new Error('Usuario já existe!');
            }


            const user = await GitHubUsers.search(username);
            if (user.login === undefined) {
                throw new Error(':( Usuario não encontrado!');
            }
            this.entries = [user, ...this.entries];
            this.update();
            this.save();

        } catch (error) {
            alert(error.message);
            return;
        }
    }

  

    save() {
        localStorage.setItem('@github-fav:', JSON.stringify(this.entries))
    }


    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries;
        this.update();
        this.save()
    }

}

export class FavoriteView extends Favorite {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('nav button');

        addButton.onclick = () => {
            const { value } = this.root.querySelector('nav input');

            this.add(value)
        }
    }

    userNotFound() {
        const userNot = this.root.querySelector('#notFavorite');
        if(this.entries.length === 0) {
            userNot.style.display = 'flex'
        } else {
            userNot.style.display = 'none'
        }
    }


    update() {
        this.removeAllTr();
        this.userNotFound()
        this.entries.forEach((user) => {
            const row = this.createRow();

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user a').href = `https://github.com/${user.login}`;
            row.querySelector('.user a').textContent = `/${user.login}`;
            row.querySelector('.repositories').textContent = user.public_repos;
            row.querySelector('.followers').textContent = user.followers;
    
            row.querySelector('.action button').onclick = () => {
                const isOk = confirm('Deseja realmente deletar essa linha?');
                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row);

        });
        
    }


    createRow() {
        const tr = document.createElement('tr');

        tr.className = 'users';

        tr.innerHTML = `<td class="user">
                <img src="https://github.com/.png" alt="">
                <div>
                    <p></p>
                    <a href="https://github.com/"
                        target="_blank">/</a>
                </div>
            </td>

            <td class="repositories">
                <p></p>
            </td>
            <td class="followers">
                <p></p>
            </td>

            <td class="action">
                <button>Remover</button>
            </td>

               
            `

        return tr;
    }


    removeAllTr() {

        this.tbody.querySelectorAll('.users').forEach((tr) => {
            tr.remove();
        })
            
        
    }


}