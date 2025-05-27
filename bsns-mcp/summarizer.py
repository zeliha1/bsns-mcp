
from newspaper import Article
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

def summarize_article(url):
    article = Article(url)
    article.download()
    article.parse()
    text = article.text

    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, 3)  # 3 cümlelik özet

    return " ".join(str(sentence) for sentence in summary)
