FROM apify/actor-python:3.13

COPY requirements.txt ./
RUN python3 -m pip install -r requirements.txt

COPY . ./

CMD ["python3", "-m", "src"]
