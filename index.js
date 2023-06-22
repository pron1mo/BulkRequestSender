import axios from 'axios';
import {SingleBar, Presets} from 'cli-progress'
import list from './list.json' assert { type: "json" };

const length = list.urls.length ?? 0
const options = {
    format: 'progress [{bar}] {percentage}% | {value}/{total} | duration: {duration}s | Expected Time: {eta}s'
}
const progress = new SingleBar(options, Presets.shades_classic);

progress.start(length, 0);
const errors = [];

(async () => {
    let counter = 0;
    let failure = 0;
    for (const index in list.urls) {
        let url = list.urls[index]
        await axios.post(url)
            .then(() => {
                counter++
            })
            .catch(error => {
                failure++
                errors.push(`StatusCode: ${error.response.status}, Message: ${error.message}, Url: ${url}`)
            })
            .finally(() => {
                progress.increment()
            })
    }
    progress.stop()
    console.log('----------');
    console.log(`Успешно: ${ counter } | Провалено: ${ failure } |`);
    if (failure > 0) {
        console.log('----------');
        console.log('Ошибки:');
        errors.forEach(error => {
            console.log(error);
        })
    }
})();