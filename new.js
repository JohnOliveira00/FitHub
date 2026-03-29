function toggleWeek(num) {
    const card = document.getElementById(`week-${num}`);
    if (!card.classList.contains('locked')) {
        card.classList.toggle('open');
    }
}

function toggleExercise(element, weekNum) {
    element.classList.toggle('done');
    checkWeekProgress(weekNum);
}

function checkWeekProgress(weekNum) {
    const list = document.getElementById(`list-${weekNum}`);
    const total = list.querySelectorAll('.exercise-item').length;
    const done = list.querySelectorAll('.exercise-item.done').length;
    const btn = document.getElementById(`btn-${weekNum}`);

    if (total === done && total > 0) {
        btn.disabled = false;
        btn.innerText = "Finalizar Semana " + weekNum;
    } else {
        btn.disabled = true;
       
    }
}

function finishWeek(num) {
    const current = document.getElementById(`week-${num}`);
    current.classList.remove('open', 'active');
    current.classList.add('finished');
    
    const nextNum = num + 1;
    const nextCard = document.getElementById(`week-${nextNum}`);

    if (nextCard) {
        nextCard.classList.remove('locked');
        nextCard.classList.add('active', 'open');
        alert(`Semana ${num} concluída! Próximo nível liberado.`);
    } else {
        alert("Parabéns! Você completou todo o treinamento FitHub! 🏆");
    }
}