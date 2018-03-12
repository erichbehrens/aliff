import text from './data/lorem';

const chunks = text
	.replace(/(\d) (\w)/g, '$1$2')
	.split(/ |\n/)
	.map(word =>
		word
			.replace(/^([^\d\w])/, '')
			.replace(/([^\d\w]+)$/, '')
			.replace(/(\d)([A-z][A-z]+)/g, '$1 $2'));
const unique = Array.from(new Set(chunks));

function getRandomNumber(from, to = 0) {
	const range = Math.abs(from - to);
	const min = Math.min(from, to);
	return Math.round(min + (Math.random() * range));
}

function getWord() {
	return unique[getRandomNumber(unique.length)];
}

const randomSort = () => (Math.random() < 0.5 ? -1 : 1);

const getRandom = array => array[Math.floor(Math.random() * array.length)];

function averageRandom(input, deviation = 0.3) {
	const maxDeviation = Math.round(input * deviation);
	const random = getRandomNumber(maxDeviation * 2) - maxDeviation;
	return input + random;
}

const htmlTags = 'strong,em,u'.split(',');
const titleTags = 'h2,h3,h4'.split(',');
const punctuation = '.....,,:;?!'.split('');
const finalPunctuation = '.....?!'.split('');
function getPuntuation(isFinal) {
	const actualPuntuation = isFinal ? finalPunctuation : punctuation;
	return getRandom(actualPuntuation); // [Math.floor(Math.random() * actualPuntuation.length)];
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWords(count, flatten = true, html = false) {
	const words = [];
	words.push(capitalize(getWord()));
	for (let i = 1; i < count; i++) {
		if (html && Math.random() > 0.8) {
			const tag = getRandom(htmlTags);
			const groupSize = getRandomNumber(3);
			const groupWords = [];
			for (let j = 0; j < groupSize; j++) {
				groupWords.push(getWord());
			}
			words.push(`<${tag}>${groupWords.join(' ')}</${tag}>`);
		} else {
			words.push(getWord());
		}
	}
	return flatten ? words.join(' ') : words;
}

function getSentence(words, isFinal, html = false) {
	return getWords(words - 1, false, html).concat(getWord() + getPuntuation(isFinal)).join(' ');
}

function getSentences(count, words, flatten = true, html = false) {
	const sentences = [];
	if (html) {
		const titleTag = getRandom(titleTags);
		sentences.push(`<${titleTag}>${getWords(averageRandom(3))}</${titleTag}>`);
	}
	for (let i = 0; i < count - 1; i++) {
		sentences.push(getSentence(averageRandom(words, 0.5), false, html));
	}
	sentences.push(getSentence(words, true, html));
	return flatten ? sentences.join(' ') : sentences;
}

function getParagraphs(count, paragraphSentences, words = 12, html = false) {
	const paragraphs = [];
	paragraphs.push(getSentences(paragraphSentences, words, true, html));
	for (let i = 0; i < count - 1; i++) {
		paragraphs.push(getSentences(averageRandom(paragraphSentences), words, true, html));
	}
	return paragraphs.sort(randomSort).join('\n');
}

function getEmail() {
	const userSeparators = ['', '.', '_'];
	const domainSeparators = ['', '', '-', '-', '.'];
	const domains = ['com', 'net', 'org'];
	const address = [];
	if (Math.random() < 0.2) {
		address.push(getRandomNumber(99));
	}
	address.push(getWord());
	address.push(getRandom(userSeparators));
	address.push(getWord());
	if (Math.random() < 0.3) {
		address.push(getRandomNumber(99));
	}
	address.push('@');
	address.push(getWord());
	if (Math.random() < 0.3) {
		address.push(getRandom(domainSeparators));
		address.push(getWord());
	}
	address.push('.');
	address.push(getRandom(domains));
	return address.join('');
}

export {
	getWords,
	getSentences,
	getParagraphs,
	getEmail,
	getRandomNumber,
};
