library('ggplot2')
library('scales')
library('RColorBrewer')

data <- read.csv('output/quality-data2.csv')
data$metric <- ordered(data$metric, levels=c('recall', 'primaryrecall', 'secondaryrecall', 'inaccuracy', 'misdirection', 'area'))
data$source <- ordered(data$source, levels=rev(c('nyt', 'wp', 'npr', 'guardian', 'fivethirtyeight', 'bloomberg')))

metrics <- ggplot(subset(data, metric!='area'), aes(fill=source,x=source, y=value)) +
  facet_wrap(~metric) +
  scale_fill_manual(values=c("#556270", "#4ecdc4", "#c7f464", "#ff6B6B", "#c44d58", "#EDC951")) +
  scale_y_continuous(labels = scales::percent) +
  geom_bar( stat = "identity") +
  coord_flip() +
  geom_text(aes(y=value + 0.1, label = sprintf("%1.1f%%", 100*value))) +
  theme_bw() 

ggsave('images/metrics.png')

ggplot(subset(data, metric=='area'), aes(fill=source, x=source, y=value)) +
  scale_fill_manual(values=c("#556270", "#4ecdc4", "#c7f464", "#ff6B6B", "#c44d58", "#EDC951")) +
  geom_bar( stat = "identity") +
  coord_flip() +
  geom_text(aes(y=value + 3, label= value)) +
  theme_bw() 

ggsave('images/area.png')
