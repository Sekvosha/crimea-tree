const config = {
    owner: 'Sekvosha',
    repo: 'crimea-tree',
    branch: 'main',
    folder: 'data'
};

const file_container = document.getElementById('file_div');

async function getFileTree(){
    try {
        const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.folder}/`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

         // Убедимся, что data - массив
        if (!Array.isArray(data)) {
            throw new Error('GitHub API вернул неожиданные данные (ожидался массив)');
        }
        console.log('get file tree: SUCCES')
        return data.filter(item => item.type === 'file').map(item => item.path);
    }catch(error){
        console.error('Ошибка при получении дерева файлов:', error);
        throw error;
    }
}

async function GetFileContent(file_path){
    const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${file_path}`;
    try{
        const response = await fetch(url);

        if(!response.ok){
            throw new Error(`Ошибка HTTP: ${response.status}`)
        }
        return await response.text();
    } catch(error){
        console.error(`Ошибка при загрузке файла ${filePath}:`, error);
        return `Не удалось загрузить файл: ${error.message}`;
    }
}



async function DisplayFiles(){
    const files = await getFileTree();
    console.log('Получен список файлов: ', files)
    for(const file_path of files){
        const file_block = document.createElement(`div`);
        file_block.className = 'file_div';

        header = file_path.replace(config.folder+'/', '')
        header = header.replace('.md', '')
        header = header.charAt(0).toUpperCase() + header.slice(1)
        header = '🌲 ' + header;

        file_block.innerHTML = `
            <div class="t004">

                <div class="t-container ">
                <div class="t-col t-col_8 t-prefix_2">
                    <h3>${header}</h3>
                    <div field="text" class="loading ">Загрузка...</div>
                </div>
                </div>
            </div>
            <br>
        `;
        file_container.appendChild(file_block);

        const content = await GetFileContent(file_path);

        const content_element = document.createElement('pre');
        content_element.textContent = content;
        content_element.classList.add('t-text');
        content_element.classList.add('t-text-md');
        content_element.classList.add('padd');
        
        file_block.querySelector('.loading').replaceWith(content_element);
    }
}

DisplayFiles();