## compute_input.py

import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    np_lines = np.array(lines)

    #use numpys sum method to find sum of all elements in the array
    lines_sum = np.sum(np_lines)

    #return the sum to the output stream
    #print lines_sum
    articles = str(
    {
        "article1" : 
        {   "Title" : "McCain's Decision on AHCA",
            "Source" : "NATIONAL REVIEW",
            "Objective" : "35% Objective"

        },
        "article2" : 
        {   "Title" : "McConnell's Plan",
            "Source" : "WALL STREET JOURNAL",
            "Objective" : "76% Objective"
        },
        "article3" : 
        {   "Title" : "Why the Skinny Repeal Failed",
            "Source" : "NEW YORK TIMES",
            "Objective" : "64% Objective"
        },
    })

    print(articles)

#start process
if __name__ == '__main__':
    main()