echo "please ensure this script is run in root dir of project"
echo "if not, exit this program to avoid messing my project up"
echo "you have 3 seconds"
echo ""
echo "...waiting.."
sleep 3

echo ""
if pg_ctl status &> /dev/null; then
	echo "PG Server is already running";
else
	echo "starting PG server";
	pg_ctl start;
fi

echo "";
echo "running schema script";
cd "./schema";

dbusername="themanprince"
dbname="prechitocollections"

psql -U $dbusername -d $dbname -c "\i './db_setup.sql'";

cd "..";

npm start; #I believe below kini gotta wait for this to terminate first

echo ""
psql -U $dbusername -d $dbname -c "DROP SCHEMA pc_admin CASCADE";
psql -U $dbusername -d $dbname -c "DROP SCHEMA pc_product CASCADE";

pg_ctl stop

sleep 0.5 && clear