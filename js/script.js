const config = {
      repoOwner: 'Sekvosha',
      repoName: 'crimea-tree',
      branch: 'main',
      files: [
        'data/hello.md',
        'data/second.md'
    ]
};

const file_container = document.getElementById('file_div');

async function GetFileContent(file_path) {
    const url = `https://raw.githubusercontent.com/${config.repoOwner}/${config.repoName}/${config.branch}/${file_path}`;
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

async function DisplayFiles() {
    for(const file_path of config.files){
        const file_block = document.createElement(`div`);
        file_block.className = 'file_div';
        file_block.innerHTML = `
        <h3>${file_path}</h3>
        <div class="loading">Загрузка...</div>
        `;
        file_container.appendChild(file_block);

        const content = await GetFileContent(file_path);

        const content_element = document.createElement('pre');
        content_element.textContent = content;
        file_block.querySelector('.loading').replaceWith(content_element);
    }
}

DisplayFiles();