#  k6-grafana-influxdb-docker-compose

Project based on the design provided on the [repository](https://github.com/luketn/docker-k6-grafana-influxdb).

This is a repository for designing dashboards and scenarios describing good practices in K6.

## TODO

- [ ] Check InfluxDB limits (requests):

```bash
ERRO[0079] Couldn't write stats                          error="{\"error\":\"Request Entity Too Large\"}\n" output=InfluxDBv1
```

Occurs on high load (xk6-kafka scripts on > 5 VUs).
