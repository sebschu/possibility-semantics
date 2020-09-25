library(tidyverse)

# Script to create data to estimate model parameters from pre-exposure ratings

setwd("/Users/sebschu/Dropbox/Uni/RA/adaptation/possible-might-project/models/1_threshold_modals/scripts/")

load_data = function(fname) {
  d = read.csv(fname)
  
  d$modal1 = gsub('"', '', d$modal1)
  d$modal2 = gsub('"', '', d$modal2)
  d$pair = gsub('"', '', d$pair)
  d$color = gsub('"', '', d$color)
  
  d_blue = d %>% filter(., grepl("blue", sentence2))
  d_orange = d %>% filter(., grepl("orange", sentence2))
  
  d_orange_reverse = d_orange
  d_orange_reverse$percentage_blue = 100-d_orange$percentage_blue
  
  d_comparison = rbind(d_blue, d_orange_reverse)
  d_comparison$blue= grepl("blue", d_comparison$sentence2)
  
  d_comparison = d_comparison %>% select(pair,rating1,rating2,modal1,modal2,rating_other,workerid,percentage_blue)
  
  return(d_comparison)
}


## Load data from conditions 0-20

d = data.frame()
for (i in 0:20) {
  fname = paste("/Users/sebschu/Dropbox/Uni/RA/adaptation/adaptation/experiments/0_pre_test/data/0_pre_test-cond", i , "-trials.csv", sep="")
  d.part = load_data(fname)
  if (grepl("looks_like", d.part$pair[1]) | grepl("think", d.part$pair[1])) {
    next
  }
  print(i)
  d = rbind(d, d.part)
}

for (i in 21:31) {
  fname = paste("/Users/sebschu/Dropbox/Uni/RA/adaptation/adaptation/experiments/13_additional_norming/data/13_additional_norming-cond", i , "-trials.csv", sep="")
  d.part = load_data(fname) %>% arrange(workerid)
  print(i)
  # in some conditions I collected more than 20 participant, only consider first 20 participants
  d = rbind(d, d.part[1:720,])
}

d = d %>% group_by(pair,workerid,percentage_blue, modal1, modal2) %>% summarize(rating1=mean(rating1), rating2=mean(rating2), rating_other=mean(rating_other))

d_obs =  do.call("rbind", replicate(20, d, simplify = FALSE))

d_obs = d_obs %>%
  rowwise() %>%
  mutate(rating1 = max(0, rating1), rating2 = max(0, rating2), rating_other = max(0, rating_other))
d_obs = d_obs %>%
  rowwise() %>%
  mutate(modal = sample(c(modal1, modal2, "other" ), prob = c(rating1, rating2, rating_other), size=1))  


data = list(obs = d_obs)

data_string = jsonlite::toJSON(data, digits = NA)

cat(data_string, file = "../data/data_possible_might.json")

