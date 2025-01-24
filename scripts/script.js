let expanded = false
let closing = false
let opening = false

document.addEventListener("DOMContentLoaded", async () => {
    const filmList = document.querySelector('.film-list');

    // `data/info.json`에서 데이터를 가져오는 함수
    const getFilmData = async () => {
        try {
            const response = await fetch('data/info.json');
            if (!response.ok) {
                throw new Error('Failed to fetch film data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading film data:', error);
            return [];
        }
    };

    const films = await getFilmData();

    films.forEach(film => {
        const filmCase = document.createElement('div');
        filmCase.classList.add('film-case');
        filmCase.id = film.id;
        filmCase.dataset.images = film.images;

        const filmImg = document.createElement('img');
        filmImg.src = `data/films/${film.id}/film.png`;
        filmCase.appendChild(filmImg);

        const filmSpreaded = document.createElement('div');
        filmSpreaded.classList.add('film-spreaded');

        const scrollDiv = document.createElement('div');
        scrollDiv.classList.add('scroll-div');
        scrollDiv.style.setProperty('--photo-count', film.images); // 사진 개수 동적 설정

        const filmBackground = document.createElement('div');
        filmBackground.classList.add('film-background');
        filmBackground.style.setProperty('--photo-count', film.images); // 사진 개수 동적 설정

        const filmEnd = document.createElement('div');
        filmEnd.classList.add('film-end');

        scrollDiv.appendChild(filmBackground);
        scrollDiv.appendChild(filmEnd);
        filmSpreaded.appendChild(scrollDiv);
        filmCase.appendChild(filmSpreaded);

        filmList.appendChild(filmCase);

        // 클릭 이벤트
        filmImg.addEventListener('click', () => {
            const isExpanded = filmCase.classList.contains('expanded');


            if (!isExpanded && !expanded) {
                filmCase.classList.add('expanded');
                expanded = true
                // 이미지 로드
                if (!filmBackground.hasChildNodes()) {
                    for (let i = 0; i < film.images; i++) {
                        const photo = document.createElement('div');
                        photo.classList.add('photo');
                        photo.style.backgroundImage = `url(data/films/${film.id}/${i}.jpg)`;

                        //사진 클릭시 뷰어 보여주기
                        photo.addEventListener('click', ()=>{
                            if(!opening){
                                const viewer = document.getElementsByClassName('viewer')[0]
                                document.getElementById('now-photo').src = `data/films/${film.id}/${i}.jpg`;
                                viewer.style.display = 'block';
                                opening = true
                                
                                viewer.style.opacity = 0;
                                anime = setInterval(() => {
                                    console.log(viewer.style.opacity)
                                    if(viewer.style.opacity >= 1){
                                        clearInterval(anime)
                                        opening = false
                                    }
                                    viewer.style.opacity =  Number(viewer.style.opacity) + 0.02;
                                }, 10)
                            }
                            
                        })
                        filmBackground.appendChild(photo);
                    }
                }

                requestAnimationFrame(() => {
                    filmSpreaded.scrollLeft = filmSpreaded.scrollWidth; // 오른쪽 끝으로 이동
                    console.log('hello')
                    setTimeout(() => {
                        filmSpreaded.scrollTo({
                            left: 0,
                            behavior: 'smooth', // 부드럽게 이동
                        });
                    }, 500); // 오른쪽 끝에서 약간의 지연 후 왼쪽으로 이동
                });
            }
            if (isExpanded && expanded){
                requestAnimationFrame(() => {
                    console.log('bye')
                    setTimeout(() => {
                        filmSpreaded.scrollTo({
                            left: filmSpreaded.scrollWidth,
                            behavior: 'smooth', // 부드럽게 이동
                        });
                        
                    }, 200); // 오른쪽 끝에서 약간의 지연 후 왼쪽으로 이동
                    setTimeout(() => {
                        document.querySelectorAll('.film-case').forEach(caseEl => {
                            caseEl.classList.remove('expanded');
                        });
                        expanded = false
                    }, 1500)
                });
            }
        });
    });
});

function closeViewer(){ 
    if(!closing){
        closing = true
        const viewer = document.getElementsByClassName('viewer')[0]
        viewer.style.opacity = 1;
        anime = setInterval(() => {
            console.log(viewer.style.opacity)
            if(viewer.style.opacity <= 0){
                clearInterval(anime)
                viewer.style.display = 'none';
                closing = false
            }
            viewer.style.opacity =  Number(viewer.style.opacity) - 0.02;
        }, 10)
    }
}