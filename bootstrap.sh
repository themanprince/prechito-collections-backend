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

psql -U themanprince -d prechitocollections -c "\i './db_setup.sql'";

cd "..";

npm start;