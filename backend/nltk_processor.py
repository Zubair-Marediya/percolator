
# coding: utf-8

# In[110]:

import nltk
from rake_nltk import Rake
#nltk.download('stopwords')
import urllib.request
from bs4 import BeautifulSoup
import webhoseio
from nltk.corpus.util import *
import nltk.tokenize
from nltk.tokenize import sent_tokenize
from nltk.corpus import subjectivity
from nltk import sentiment
from nltk.classify import NaiveBayesClassifier
from nltk.tokenize import regexp
import pickle
import json
import sys


# In[111]:

# Get title and text from url

def get_only_text(url):
 """ 
  return the title and the text of the article
  at the specified url
 """
 page = urllib.request.urlopen(url).read().decode('utf8')
 soup = BeautifulSoup(page, "lxml")
 text = ' '.join(map(lambda p: p.text, soup.find_all('p')))
 return soup.title.text, text


# In[112]:

# produce a list of keyword phrases from the text
def keyword_phrases(txt):
    r = Rake()
    r.extract_keywords_from_text(txt)
    list(r.get_ranked_phrases())
    return(list(r.get_ranked_phrases()))


# In[114]:

# Need pickle file in order to not retrain this classifier
#nltk.sentiment.util.demo_subjectivity(NaiveBayesClassifier.train, "sa_subjectivity.pickle")
sentim_analyzer = pickle.load(open('sa_subjectivity.pickle', 'rb'))
def sent_subj(text):
    #from nltk.classify import NaiveBayesClassifier
    #from nltk.tokenize import regexp
    word_tokenizer = regexp.WhitespaceTokenizer()
    sentim_analyzer = pickle.load(open('sa_subjectivity.pickle', 'rb'))
    tokenized_text = [word.lower() for word in word_tokenizer.tokenize(text)]
    #print(sentim_analyzer.classify(tokenized_text))
    return(sentim_analyzer.classify(tokenized_text))

def subj_rating(txt):
    sents = sent_tokenize(txt)
    k = 0
    for s in sents:
        if (str(sent_subj(s)) == "subj"):
            k = k+1
    return(k/len(sents))


# In[115]:

L = ["newyorker.com", "slate.com", "theguardian.com", "aljazeera.com",
    "npr.org", "nytimes.com", "pbs.org", "bbc.com", "washingtonpost.com",
    "economist.com", "politico.com"]
CL = ["msnbc.com", "cnn.com", "nbc.com"]
C = ["cbs.com", "bloomberg.com", "abc.com", "usatoday.com", "yahoo.com", "wsj.com"]
CR = ["foxnews.com", "drudgereport.com", "nationalreview.com"]
R = ["breitbart.com", "rushlimbaugh.com", "theblaze.com", "glenbeck.com"]

site_dict = {}
for s in L:
    site_dict[s] = "L"
for s in CL:
    site_dict[s] = "CL"
for s in C:
    site_dict[s] = "C"
for s in CR:
    site_dict[s] = "CR"
for s in R:
    site_dict[s] = "R"
#
S = L + CL + C + CR + R
sites_str = '('
for s in S:
    sites_str = sites_str + "site:" + s + " OR "
sites_str = sites_str[:-4] + ")"


# In[116]:

#"q": "(site:yahoo.com OR site:cnn.com OR site:reuters.com) \"United States\"",
#query_str = sites_str + "\"United States\""
def query(query_str):
    webhoseio.config(token="b8df7c9b-df5e-4bea-9e57-63540110e489")
    query_params = {
        "q": query_str,
        "sort": "relevancy"
    }
    output = webhoseio.query("filterWebContent", query_params)
    return(output['posts'])


# In[117]:

def post_dict(post):
    d = {}
    d['code'] = site_dict[post['thread']['site']]
    d['site'] = post['thread']['site']
    d['url'] = post['url']
    d['title'] = post['title']
    text = post['text']
    d['objectivity'] = 1 - subj_rating(text)
    #print(d)
    return d


# In[118]:

def find_articles(ranked_phrases):
    found = [0,0,0]
    C_dict = {}
    R_dict = {}
    L_dict = {}
    for i in range(len(ranked_phrases)):
        query_str = sites_str + "\""+ ranked_phrases[i] +"\" language:english"
        output = query(query_str)
        if (len(output)):
            for j in range(0, (len(output)-1)):
                post = output[j]
                site = post['thread']['site']
                code = site_dict[site]
                if ((code == "C") & (not found[1])):
                    C_dict = post_dict(post)
                    found[1] = 1
                elif (((code == "L") | (code == "CL")) & (not found[0])):
                    L_dict = post_dict(post)
                    found[0] = 1
                elif (((code == "R") | (code == "CR")) & (not found[2])):
                    R_dict = post_dict(post)
                    found[2] = 1
                if (found==[1,1,1]):
                    return(C_dict, L_dict, R_dict)     


# In[119]:

def main():
    #print(sys.argv)
    #url = sys.argv[1]
    #url = "https://www.nytimes.com/2017/08/04/us/politics/jeff-sessions-trump-leaks-attorney-general.html"
    url = json.loads(sys.stdin.readlines()[0])
    title, txt = get_only_text(url)
    ranked_phrases = keyword_phrases(txt)
    c_d, l_d, r_d = find_articles(ranked_phrases)
    c_json = json.dumps(c_d)
    l_json = json.dumps(l_d)
    r_json = json.dumps(r_d)
    print(c_json)
    print(l_json)
    print(r_json)
    
if __name__ == "__main__":
    main()

